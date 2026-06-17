import { FindManyOptions, Repository } from 'typeorm';
import { PaginationDto } from '../dto/pagination.dto';
import { PaginatedResult, PaginationMeta } from '../interfaces/api-response.interface';

 
export async function paginate<T>(
  repository: Repository<T>,
  { page, limit }: PaginationDto,
  options: FindManyOptions<T> = {},
): Promise<PaginatedResult<T>> {
  const skip = (page - 1) * limit;

  const [data, total] = await repository.findAndCount({
    ...options,
    skip,
    take: limit,
  });

  const lastPage = total === 0 ? 1 : Math.ceil(total / limit);
  const meta: PaginationMeta = { total, page, lastPage, limit };

  return { data, meta };
}
