interface IUserAttributes {
  id?: number;
  name: string;
  email: string;
  password?: string;
  password_hash?: string;
  admin?: boolean;
}

export default IUserAttributes;
