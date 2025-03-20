export type User = {
    id: number
    name: string
    email: string
    birth_date: string
    token?: string
}

export interface Paginate<T> {
    data: T[]
    lastPage: number
    total: number
}

export type Home = {
    id: number
    picture_path: string
    user_id: number
    user_name: string
    address: string
    city: string
    description: string
    cost_day: number
    cost_week: number
    cost_month: number
    restriction_id: number
    restriction_name: string
    restriction_description: string
    share_type_id: number
    share_type_name: string
    share_type_description: string
}

export type Utensil = {
    id: number
    name: string
}