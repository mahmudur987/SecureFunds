/* eslint-disable @typescript-eslint/no-explicit-any */
import { Query } from "mongoose";

const excludeField = ["page", "limit", "sort", "fields", "searchTerm"];

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  filter(): this {
    const filter = { ...this.query };

    for (const field of excludeField) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete filter[field];
    }

    this.modelQuery = this.modelQuery.find(filter); // Tour.find().find(filter)

    return this;
  }

  search(searchableField: string[]): this {
    const searchTerm = this.query.searchTerm || "";
    const searchQuery = {
      $or: searchableField.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    };
    this.modelQuery = this.modelQuery.find(searchQuery);
    return this;
  }

  sort(): this {
    const sort = this.query.sort || "-createdAt";

    this.modelQuery = this.modelQuery.sort(sort);

    return this;
  }
  fields(): this {
    const fields = this.query.fields?.split(",").join(" ") || "";

    this.modelQuery = this.modelQuery.select(fields);

    return this;
  }
  paginate(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  build() {
    return this.modelQuery;
  }

  async getMeta() {
    const totalDocuments = await this.modelQuery.model.countDocuments();

    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;

    const totalPage = Math.ceil(totalDocuments / limit);

    return { page, limit, total: totalDocuments, totalPage };
  }
}

interface QueryOptions {
  searchFields?: string[];
  excludeFields?: string[];
}

export default async function BuildQuery<T>(
  modelQuery: Query<T[], T>,
  query: Record<string, any>,
  searchFields: string[] = []
) {
  const {
    excludeFields = [
      "page",
      "limit",
      "sort",
      "fields",
      "searchTerm",
      "populate",
    ],
  } = {} as QueryOptions;
  console.log(query);
  // 1️⃣ Filter
  const filters = { ...query };
  excludeFields.forEach((field) => delete filters[field]);
  modelQuery = modelQuery.find(filters);

  // 2️⃣ Search
  if (query.searchTerm && searchFields.length > 0) {
    const searchQuery = {
      $or: searchFields.map((field) => ({
        [field]: { $regex: query.searchTerm, $options: "i" },
      })),
    };
    modelQuery = modelQuery.find(searchQuery);
  }

  // 3️⃣ Sort
  const sort = query.sort || "-createdAt";
  modelQuery = modelQuery.sort(sort);

  // 4️⃣ Fields
  if (query.fields) {
    const fields = query.fields.split(",").join(" ");
    modelQuery = modelQuery.select(fields);
  }

  // 5️⃣ Populate
  if (query.populate) {
    const populate = query.populate.split(",").join(" ");
    modelQuery = modelQuery.populate(populate);
  }

  // 6️⃣ Pagination
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  modelQuery = modelQuery.skip(skip).limit(limit);

  // 7️⃣ Execute query
  const data = await modelQuery;

  // 8️⃣ Meta info
  const total = await modelQuery.model.countDocuments(filters);
  const totalPage = Math.ceil(total / limit);

  const meta = { page, limit, total, totalPage };

  return { data, meta };
}

// // In controller
// import { buildQuery } from "../utils/queryBuilder";

// export const getTours = async (req, res) => {
//   try {
//     const { data, meta } = await buildQuery(Tour.find(), req.query, {
//       searchFields: ["name", "description"],
//     });

//     res.json({ success: true, data, meta });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
