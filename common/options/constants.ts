
/**
 * Converts object properties to Mongoose enum (string array)
 *
 *
 * @param {any} obj
 * @returns {string[]}
 */
function obj2enum(obj: any): string[] {
  let arr: string[] = []

  for (let key in obj) {
    arr.push(obj[key])
  }

  return arr
}

/**
 * User types
 */
interface IUserTypes {
  CONSUMER: string
  SUPPLIER: string
  PLATFORM: string
}

// Use model names for referencing
export const USER_TYPES: IUserTypes = {
  CONSUMER: 'Consumer',
  SUPPLIER: 'Supplier',
  PLATFORM: 'Platform'
}

export const USER_TYPES_ENUM: string[] = obj2enum(USER_TYPES)

/**
 * User roles
 */
interface IUserRoles {
  CONSUMER: {
    GUEST: string
    MEMBER: string
    CONTRIBUTOR: string
    ORGANIZER: string
  }
  SUPPLIER: {
    STAFF: string
    EDITOR: string
    SUPERVISOR: string
    MANAGER: string
  }
  PLATFORM: {
    ADMIN: string
    SUPER: string
  }
}

export const USER_ROLES: IUserRoles = {
  CONSUMER: {
    GUEST: 'guest',
    MEMBER: 'member',
    CONTRIBUTOR: 'contributor',
    ORGANIZER: 'organizer'
  },
  SUPPLIER: {
    STAFF: 'staff',
    EDITOR: 'editor',
    SUPERVISOR: 'supervisor',
    MANAGER: 'manager'
  },
  PLATFORM: {
    ADMIN: 'admin',
    SUPER: 'super'
  }
}

export const CONSUMER_USER_ROLES_ENUM: string[] = obj2enum(USER_ROLES.CONSUMER)
export const SUPPLIER_USER_ROLES_ENUM: string[] = obj2enum(USER_ROLES.SUPPLIER)
export const PLATFORM_USER_ROLES_ENUM: string[] = obj2enum(USER_ROLES.PLATFORM)

/**
 * User action types
 */
interface IUserActions {
  ALL: {
    CREATE: string
    UPDATE: string
    DELETE: string
  }
  CONSUMER: {
    CREATE: string
    UPDATE: string
    DELETE: string
    LOGIN: string
    LOGOUT: string
    LIKE: string
    UNDO_LIKE: string
    DISLIKE: string
    UNDO_DISLIKE: string
    SAVE: string
    UNDO_SAVE: string
    SHARE: string
    DOWNLOAD: string
    REMOVE: string
    FOLLOW: string
    UNFOLLOW: string
    SUBSCRIBE: string
    UNSUBSCRIBE: string
    SUBMIT: string
    RETRACT: string
  }
  SUPPLIER: {
    CREATE: string
    UPDATE: string
    DELETE: string
    ENROLL: string
    UNDO_ENROLL: string
    LOGIN: string
    LOGOUT: string
  }
  PLATFORM: {
    CREATE: string
    UPDATE: string
    DELETE: string
    LOGIN: string
    LOGOUT: string
    VERIFY: string
    APPROVE: string
    REJECT: string
    SUSPEND: string
  }
}

export const USER_ACTIONS: IUserActions = {
  ALL: {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE'    
  },
  CONSUMER: {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    LIKE: 'LIKE',
    UNDO_LIKE: 'UNDO_LIKE',
    DISLIKE: 'DISLIKE',
    UNDO_DISLIKE: 'UNDO_DISLIKE',
    SAVE: 'SAVE',
    UNDO_SAVE: 'UNDO_SAVE',
    SHARE: 'SHARE',
    DOWNLOAD: 'DOWNLOAD',
    REMOVE: 'REMOVE',
    FOLLOW: 'FOLLOW',
    UNFOLLOW: 'UNFOLLOW',
    SUBSCRIBE: 'SUBSCRIBE',
    UNSUBSCRIBE: 'UNSUBSCRIBE',
    SUBMIT: 'SUBMIT',
    RETRACT: 'RETRACT'
  },
  SUPPLIER: {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    ENROLL: 'ENROLL',
    UNDO_ENROLL: 'UNDO_ENROLL',
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT'
  },
  PLATFORM: {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    VERIFY: 'VERIFY',
    APPROVE: 'APPROVE',
    REJECT: 'REJECT',
    SUSPEND: 'SUSPEND'
  }
}

export const CONSUMER_USER_ACTIONS_ENUM: string[] = obj2enum(USER_ACTIONS.CONSUMER)
export const SUPPLIER_USER_ACTIONS_ENUM: string[] = obj2enum(USER_ACTIONS.SUPPLIER)
export const PLATFORM_USER_ACTIONS_ENUM: string[] = obj2enum(USER_ACTIONS.PLATFORM)

/**
 * User action targets
 */
interface IActionTargets {
  [key: string]: string
  CONSUMER: string
  SUPPLIER: string
  PLATFORM: string
  POST: string
  EVENT: string
  PRODUCT: string
  ORDER: string
  COMMENT: string
}

export const ACTION_TARGETS: IActionTargets = {
  CONSUMER: 'Consumer',
  SUPPLIER: 'Supplier',
  PLATFORM: 'Platform',
  POST: 'Post',
  EVENT: 'Event',
  PRODUCT: 'Product',
  ORDER: 'Order',
  COMMENT: 'Comment'
}

export const ACTION_TARGETS_ENUM: string[] = obj2enum(ACTION_TARGETS)

/**
 * Action models
 */
interface IActionModels {
  [key: string]: string
  LIKE: string
  DISLIKE: string
  SAVE: string
  SHARE: string
  DOWNLOAD: string
  FOLLOW: string
}

export const ACTION_MODELS: IActionModels = {
  LIKE: 'Like',
  DISLIKE: 'Dislike',
  SAVE: 'Save',
  SHARE: 'Share',
  DOWNLOAD: 'Download',
  FOLLOW: 'Follow'
}

export const ACTION_MODELS_ENUM: string[] = obj2enum(ACTION_MODELS)

/**
 * Object statuses
 */
interface IStatuses {
  USER: {
    ACTIVE: string
    SUSPENDED: string
  }
  POST: {
    EDITING: string
    PENDING: string
    APPROVED: string
    SUSPENDED: string
    EXPIRED: string
  }
  EVENT: {
    EDITING: string
    PENDING: string
    APPROVED: string
    CONCLUDED: string
    SUSPENDED: string
    EXPIRED: string
  },
  SET: {
    ACCEPTING: string
    FILLED: string
    PASTDUE: string
    CONCLUDED: string
    SUSPENDED: string
  },
  SIGNUP: {
    PENDING: string
    APPROVED: string
    REJECTED: string
  }
  PAYMENT: {
    PENDING: string
    PROCESSING: string
    SUCCESS: string
    VERIFIED: string
    FAILED: string
    CANCELED: string
    DUPLICATED: string
    NETWORK: string
    UNKNOWN: string
  }
}

export const STATUSES: IStatuses = {
  USER: {
    ACTIVE: 'active',
    SUSPENDED: 'suspended'
  },
  POST: {
    EDITING: 'editing',
    PENDING: 'pending',
    APPROVED: 'approved',
    SUSPENDED: 'suspended',
    EXPIRED: 'expired'
  },
  EVENT: {
    EDITING: 'editing',
    PENDING: 'pending',
    APPROVED: 'approved',
    CONCLUDED: 'concluded',
    SUSPENDED: 'suspended',
    EXPIRED: 'expired'
  },
  SET: {
    ACCEPTING: 'accepting',
    FILLED: 'filled',
    PASTDUE: 'pastdue',
    CONCLUDED: 'concluded',
    SUSPENDED: 'suspended'
  },
  SIGNUP: {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
  },
  PAYMENT: {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SUCCESS: 'success',
    VERIFIED: 'verified',
    FAILED: 'failed',
    CANCELED: 'canceled',
    DUPLICATED: 'duplicated',
    NETWORK: 'network connection error',
    UNKNOWN: 'unknown'
  }
}

export const USER_STATUSES_ENUM = obj2enum(STATUSES.USER)
export const POST_STATUSES_ENUM = obj2enum(STATUSES.POST)
export const EVENT_STATUSES_ENUM = obj2enum(STATUSES.EVENT)
export const SET_STATUSES_ENUM = obj2enum(STATUSES.SET)
export const SIGNUP_STATUSES_ENUM = obj2enum(STATUSES.SIGNUP)
export const PAYMENT_STATUSES_ENUM = obj2enum(STATUSES.PAYMENT)

/**
 * Payment methods
 */
interface IPaymentMethods {
  CASH: string
  ALIPAY: string
  WECHAT: string
}

export const PAYMENT_METHODS: IPaymentMethods = {
  CASH: 'cash',
  ALIPAY: 'Alipay',
  WECHAT: 'WeChat_Pay'
}

export const PAYMENT_METHODS_ENUM = obj2enum(PAYMENT_METHODS)

/**
 * Consumer user default handle prefix
 */
export const CONSUMER_HANDLE_PREFIX: string = 'User_'

/**
 * Default expiration time for user token
 */
export const USER_TOKEN_EXPIRATION_DURATION: [any, number] = ['days', 90]

/**
 * Default number of list items per page
 */
export const DEFAULT_PAGE_COUNT: number = 20

/**
 * Default number of comments to showcase
 */
export const COMMENT_SHOWCASE_COUNT: number = 3

/**
 * Consumer information opened to the public
 */
export const PUBLIC_CONSUMER_INFO: string = 'handle gender avatar status postCount eventCount commentCount likes dislikes saves shares followers followings points level viewCount'

/**
 * Consumer information embeded in lists
 */
export const PUBLIC_CONSUMER_INFO_LIST: string = '-_id handle gender avatar status postCount eventCount commentCount points level totalFollowers viewCount'

export const CONSUMER_POST_SHOWCASE_COUNT: number = 3

export const CONSUMER_POST_SHOWCASE_KEYS: string = 'slug title excerpt hero tags'

export const CONSUMER_EVENT_SHOWCASE_COUNT: number = 3

export const CONSUMER_EVENT_SHOWCASE_KEYS: string = 'slug title excerpt hero tags'

export const DEFAULT_SORT_ORDER: any = {
  'viewCount': -1,
  '_id': -1
}

export const COMMENT_PARENT_FIELD_LIST: string = 'creator slug title excerpt comments commentCount totalRating averageRating'
export const LIKE_PARENT_FIELD_LIST: string = 'creator slug title excerpt likes likeCount'

export const SUBLISTS: string[] = ['likes', 'dislikes', 'saves', 'shares', 'downloads']