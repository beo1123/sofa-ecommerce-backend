const { SQL, transaction } = require('../db/client')
const { orderQueue } = require('../workers/queue')

function generateOrderNumber() {
  const d = new Date()
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(
    d.getDate()
  ).padStart(2, '0')}`
  const rand = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')
  return `ORD-${ymd}-${rand}`
}

async function createOrder({ items, recipient, paymentMethod }) {
  return transaction(async (tx) => {
    let subtotal = 0
    const enriched = []

    for (const it of items) {
      const { rows } = await tx.query(SQL`
        SELECT i.id, i.quantity, i.reserved, i.sku,
               v.price, v.name,
               p.id AS "productId", p.title
        FROM "Inventory" i
        JOIN "ProductVariant" v ON v.id = i."variantId"
        JOIN "Product" p ON p.id = v."productId"
        WHERE i."variantId" = ${it.variantId}
        FOR UPDATE
      `)

      if (!rows.length) {
        throw new Error('Variant not found')
      }

      const row = rows[0]
      if (row.quantity < it.quantity) {
        throw new Error(`Insufficient stock for ${row.sku}`)
      }

      await tx.query(SQL`
        UPDATE "Inventory"
        SET quantity = quantity - ${it.quantity}
        WHERE id = ${row.id}
      `)

      const lineTotal = Number(row.price) * it.quantity
      subtotal += lineTotal

      enriched.push({
        productId: row.productId,
        variantId: it.variantId,
        sku: row.sku,
        name: `${row.title} - ${row.name}`,
        price: row.price,
        quantity: it.quantity,
        total: lineTotal,
      })
    }

    const shipping = 0
    const tax = 0
    const total = subtotal + shipping + tax
    const orderNumber = generateOrderNumber()

    const { rows: orderRows } = await tx.query(SQL`
      INSERT INTO "Order"(
        "orderNumber",
        "recipientName",
        phone,
        email,
        line1,
        city,
        province,
        subtotal,
        shipping,
        tax,
        total,
        "paymentMethod"
      )
      VALUES (
        ${orderNumber},
        ${recipient.name},
        ${recipient.phone},
        ${recipient.email || null},
        ${recipient.line1},
        ${recipient.city},
        ${recipient.province},
        ${subtotal},
        ${shipping},
        ${tax},
        ${total},
        ${paymentMethod}
      )
      RETURNING id, "orderNumber", total
    `)

    const order = orderRows[0]

    for (const it of enriched) {
      await tx.query(SQL`
        INSERT INTO "OrderItem"(
          "orderId",
          "productId",
          "variantId",
          sku,
          name,
          price,
          quantity,
          total
        )
        VALUES (
          ${order.id},
          ${it.productId},
          ${it.variantId},
          ${it.sku},
          ${it.name},
          ${it.price},
          ${it.quantity},
          ${it.total}
        )
      `)
    }

    await orderQueue.add('order.created', {
      orderId: order.id,
      orderNumber: order.orderNumber,
      email: recipient.email || null,
    })

    return order
  })
}

module.exports = { createOrder }
