
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
 * TOTP types
 */
interface ITotpTypes {
  EMAIL: string
  SMS: string
}

export const TOTP_TYPES: ITotpTypes = {
  EMAIL: 'email',
  SMS: 'sms'
}

export const TOTP_TYPES_ENUM: string[] = obj2enum(TOTP_TYPES)

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
    SUPERVISOR: string
    MANAGER: string
  }
  PLATFORM: {
    ADMIN: string
    EDITOR: string
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
    SUPERVISOR: 'supervisor',
    MANAGER: 'manager'
  },
  PLATFORM: {
    ADMIN: 'admin',
    EDITOR: 'editor',
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
  COMMON: {
    LIST: string
    GET: string
    UNIQUE: string
    CREATE: string
    UPDATE: string
    DELETE: string
    LOGIN: string
    LOGOUT: string
  }
  CONSUMER: {
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
    ENROLL: string
    UNDO_ENROLL: string
  }
  PLATFORM: {
    REQUEST: string
    HOLD: string
    CANCEL: string
    VERIFY: string
    APPROVE: string
    REJECT: string
    SUSPEND: string
  }
}

export const USER_ACTIONS: IUserActions = {
  COMMON: {
    LIST: 'LIST',
    GET: 'GET',
    UNIQUE: 'UNIQUE',
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
  },
  CONSUMER: {
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
    ENROLL: 'ENROLL',
    UNDO_ENROLL: 'UNDO_ENROLL'
  },
  PLATFORM: {
    REQUEST: 'REQUEST',
    HOLD: 'HOLD',
    CANCEL: 'CANCEL',
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
  PROCESS: string
  ACTIVITY: string
}

export const ACTION_TARGETS: IActionTargets = {
  CONSUMER: 'Consumer',
  SUPPLIER: 'Supplier',
  PLATFORM: 'Platform',
  POST: 'Post',
  EVENT: 'Event',
  PRODUCT: 'Product',
  ORDER: 'Order',
  COMMENT: 'Comment',
  PROCESS: 'Process',
  ACTIVITY: 'Activity'
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
  [key: string]: any

  CONSUMER: {
    ACTIVE: string
    SUSPENDED: string
  }
  SUPPLIER: {
    ACTIVE: string
    SUSPENDED: string
  }
  PLATFORM: {
    ACTIVE: string
    SUSPENDED: string
  }
  CONTENT: {
    EDITING: string
    PENDING: string
    APPROVED: string
    REJECTED: string
    SUSPENDED: string
    EXPIRED: string
  }
  SET: {
    ACCEPTING: string
    FILLED: string
    PASTDUE: string
    CONCLUDED: string
    SUSPENDED: string
  }
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
  PROCESS: {
    PENDING: string
    CANCELLED: string
    FINALIZED: string
  }
}

export const STATUSES: IStatuses = {
  CONSUMER: {
    ACTIVE: 'active',
    SUSPENDED: 'suspended'
  },
  SUPPLIER: {
    ACTIVE: 'active',
    SUSPENDED: 'suspended'
  },
  PLATFORM: {
    ACTIVE: 'active',
    SUSPENDED: 'suspended'
  },
  CONTENT: {
    EDITING: 'editing',
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
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
  },
  PROCESS: {
    PENDING: 'pending',
    CANCELLED: 'cancelled',
    FINALIZED: 'finalized'
  }
}

export const CONSUMER_STATUSES_ENUM = obj2enum(STATUSES.CONSUMER)
export const SUPPLIER_STATUSES_ENUM = obj2enum(STATUSES.SUPPLIER)
export const PLATFORM_STATUSES_ENUM = obj2enum(STATUSES.PLATFORM)
export const CONTENT_STATUSES_ENUM = obj2enum(STATUSES.CONTENT)
export const SET_STATUSES_ENUM = obj2enum(STATUSES.SET)
export const SIGNUP_STATUSES_ENUM = obj2enum(STATUSES.SIGNUP)
export const PAYMENT_STATUSES_ENUM = obj2enum(STATUSES.PAYMENT)

/**
 * Process types
 */
interface IProcessTypes {
  APPROVAL: string
}

export const PROCESS_TYPES: IProcessTypes = {
  APPROVAL: 'approval'
}

export const PROCESS_TYPES_ENUM = obj2enum(PROCESS_TYPES)

/**
 * Activity states
 */
interface IActivityStates {
  READY: string
  PROCESSING: string
  COMPLETED: string
}

export const ACTIVITY_STATES: IActivityStates = {
  READY: 'ready',
  PROCESSING: 'processing',
  COMPLETED: 'completed'
}

export const ACTIVITY_STATES_ENUM = obj2enum(ACTIVITY_STATES)


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
export const PUBLIC_CONSUMER_INFO: string = 'handle gender avatar status points level viewCount commentCount postCount eventCount likes dislikes saves shares dowloads followers followings'

/**
 * Consumer information embeded in lists
 */
export const PUBLIC_CONSUMER_INFO_LIST: string = 'handle gender avatar status points level totalFollowers viewCount postCount eventCount commentCount'

/**
 * Basic consumer information
 */
export const BASIC_USER_INFO: string = 'handle username avatar status points level'

export const BASIC_CONTENT_INFO: string = 'title slug'

const COUNTERS: string = ' viewCount commentCount likeCount dislikeCount saveCount shareCount downloadCount'

export const CONSUMER_POST_SHOWCASE_COUNT: number = 3

export const CONSUMER_POST_SHOWCASE_KEYS: string = 'slug title excerpt hero tags' + COUNTERS

export const CONSUMER_EVENT_SHOWCASE_COUNT: number = 3

export const CONSUMER_EVENT_SHOWCASE_KEYS: string = 'slug title excerpt hero tags' + COUNTERS

export const DEFAULT_SORT_ORDER: any = {
  'viewCount': -1,
  '_id': -1
}

export const COMMENT_PARENT_FIELD_LIST: string = 'creator slug title excerpt comments commentCount totalRating averageRating'
export const LIKE_PARENT_FIELD_LIST: string = 'creator slug title excerpt likes likeCount'

export const SUBLISTS: string[] = ['likes', 'dislikes', 'saves', 'shares', 'downloads']