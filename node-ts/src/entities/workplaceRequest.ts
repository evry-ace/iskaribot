export interface Community {
    id: string;
}

export interface From {
    id: string;
    name: string;
}

export interface Value {
    created_time: Date;
    community: Community;
    from: From;
    message: string;
    permalink_url: string;
    post_id: string;
    target_type: string;
    type: string;
    verb: string;
}

export interface Change {
    value: Value;
    field: string;
}

export interface Entry {
    id: string;
    time: number;
    changes: Change[];
}

export interface WorkplaceBody {
    entry: Entry[];
    object: string;
}

