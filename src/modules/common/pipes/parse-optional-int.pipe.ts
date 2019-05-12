import { BadRequestException } from '@nestjs/common';
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ParseOptionalIntPipe implements PipeTransform<string> {
  async transform(
    value: string | undefined | null,
    metadata: ArgumentMetadata,
  ) {
    if (value === undefined || value === null || !value.length) {
      return;
    }
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }
    return val;
  }
}
