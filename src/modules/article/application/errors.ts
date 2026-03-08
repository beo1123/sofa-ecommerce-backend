import { DomainError } from '../../../shared/errors/domain.error.js';
import { ConflictError } from '../../../shared/errors/conflict.error.js';
import { NotFoundError } from '../../../shared/errors/not-found.error.js';

export class ArticleNotFoundError extends NotFoundError {
  constructor(message = 'Article not found') {
    super(message);
  }
}

export class ArticleCategoryNotFoundError extends NotFoundError {
  constructor(message = 'Article category not found') {
    super(message);
  }
}

export class ArticleAlreadyExistsError extends ConflictError {
  constructor(field: string, value: string) {
    super(`Article with ${field} "${value}" already exists`);
  }
}

export class ArticleCategoryAlreadyExistsError extends ConflictError {
  constructor(field: string, value: string) {
    super(`Article category with ${field} "${value}" already exists`);
  }
}

export class InvalidArticleStatusError extends DomainError {
  constructor(message = 'Invalid article status') {
    super('INVALID_ARTICLE_STATUS', message, 400);
  }
}
