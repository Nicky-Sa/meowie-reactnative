import { PosterInfo } from "@/features/common/data/models/poster";
import { PaginatedResponse } from "@/features/common/data/paginated-response";

export type PosterResDto = PaginatedResponse<PosterInfo>;
