
/**
 * Converts object properties to Mongoose enum (string array)
 * 
 * @param {any} obj
 * @returns {string[]}
 */
export function obj2enum(obj: any): string[] {
  let arr = []

  for (let key in obj) {
    arr.push(obj[key])
  }

  return arr
}


/**
 * Form input limits
 */
interface IInputLimits {
  MIN_HANDLE_LENGTH: number
  MAX_HANDLE_LENGTH: number
  MIN_PASSWORD_LENGTH: number
  MAX_PASSWORD_LENGTH: number
  MIN_NAME_LENGTH: number
  MAX_NAME_LENGTH: number
}

export const INPUT_LIMITS: IInputLimits = {
  MIN_HANDLE_LENGTH: 2,
  MAX_HANDLE_LENGTH: 20,
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 16,
  MIN_NAME_LENGTH: 0,
  MAX_NAME_LENGTH: 50
}

/**
 * Form input validators
 */
interface IInputValidators {
  COUNTRY: string
  CURRENCY: string
  EMAIL: string
  IP_ADDRESS: string
  LOCALE: string
  MOBILE: string
  PID: string
  PID_LENGTH: number  
}

export const INPUT_VALIDATORS: IInputValidators = {
  COUNTRY: '^[A-Z]{2}$',
  CURRENCY: '\\d{0,10}.\\d{0,2}',
  EMAIL: '^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}$',
  IP_ADDRESS: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
  LOCALE: '^[a-z]{2}(_[A-Z]{2})?$',
  MOBILE: '^[\\d]{7,15}$',
  PID: '^(\\d{17})+(\\d|X)$',
  PID_LENGTH: 18
}

/**
 * User types
 */
interface IUserTypes {
  CONSUMER: string
  SUPPLIER: string
  PLATFORM: string
}

export const USER_TYPES: IUserTypes = {
  CONSUMER: 'CONSUMER',
  SUPPLIER: 'SUPPLIER',
  PLATFORM: 'PLATFORM'
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
  CONSUMER: string
  SUPPLIER: string
  PLATFORM: string
  POST: string
  EVENT: string
  PRODUCT: string
  ORDER: string
}

export const ACTION_TARGETS: IActionTargets = {
  CONSUMER: 'Consumer',
  SUPPLIER: 'Supplier',
  PLATFORM: 'Platform',
  POST: 'Post',
  EVENT: 'Event',
  PRODUCT: 'Product',
  ORDER: 'Order'
}

export const ACTION_TARGETS_ENUM: string[] = obj2enum(ACTION_TARGETS)

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
    PUBLISHED: string
    SUSPENDED: string
    EXPIRED: string
  }
  EVENT: {
    EDITING: string
    PENDING: string
    APPROVED: string
    PUBLISHED: string
    SUSPENDED: string
    EXPIRED: string
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
    PUBLISHED: 'published',
    SUSPENDED: 'suspended',
    EXPIRED: 'expired'
  },
  EVENT: {
    EDITING: 'editing',
    PENDING: 'pending',
    APPROVED: 'approved',
    PUBLISHED: 'published',
    SUSPENDED: 'suspended',
    EXPIRED: 'expired'
  }
}

export const USER_STATUSES_ENUM = obj2enum(STATUSES.USER)
export const POST_STATUSES_ENUM = obj2enum(STATUSES.POST)
export const EVENT_STATUSES_ENUM = obj2enum(STATUSES.EVENT)

/**
 * Consumer user default handle prefix
 */
export const CONSUMER_HANDLE_PREFIX: string = 'User_'

/**
 * Default number of list items per page 
 */
export const DEFAULT_PAGE_COUNT: number = 10

/**
 * Default number of comments to showcase
 */
export const DEFAULT_COMMENT_COUNT: number = 3

/**
 * Consumer information opened to the public
 */
export const PUBLIC_CONSUMER_INFO: string = '-_id handle gender avatar status posts events comments likes dislikes saves shares followers followings points level totalViews'

/**
 * Consumer information embeded in lists
 */
export const PUBLIC_CONSUMER_INFO_LIST: string = '-_id handle gender avatar status followers points level totalViews'
