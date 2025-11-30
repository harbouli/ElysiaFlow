import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import bcrypt from "bcrypt";

export interface UserAttributes {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  bio?: string | null;
  avatarUrl?: string | null;
  phoneNumber?: string | null;
  gender?: "male" | "female" | "other" | null;
  birthday?: Date | null;
  isBanned: boolean;
  role: "user" | "admin";
  authProvider: "local" | "google" | "apple";
  authProviderId?: string | null;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "role" | "isVerified" | "authProvider" | "authProviderId" | "isBanned"> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: number;
  declare email: string;
  declare password: string;
  declare firstName: string;
  declare lastName: string;
  declare bio: string | null;
  declare avatarUrl: string | null;
  declare phoneNumber: string | null;
  declare gender: "male" | "female" | "other" | null;
  declare birthday: Date | null;
  declare isBanned: boolean;
  declare role: "user" | "admin";
  declare authProvider: "local" | "google" | "apple";
  declare authProviderId: string | null;
  declare isVerified: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  public toJSON(): Omit<UserAttributes, "password"> {
    const { password, ...values } = this.get();
    return { ...values, fullName: this.fullName } as Omit<UserAttributes, "password"> & { fullName: string };
  }

  // Virtual field for full name
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Must be a valid email address",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6, 100],
          msg: "Password must be between 6 and 100 characters",
        },
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "First name cannot be empty",
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Last name cannot be empty",
        },
      },
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: "Must be a valid URL",
        },
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "other"),
      allowNull: true,
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    isBanned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
      allowNull: false,
    },
    authProvider: {
      type: DataTypes.ENUM("local", "google", "apple"),
      defaultValue: "local",
      allowNull: false,
    },
    authProviderId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

class UserModel {
  async findAll(): Promise<User[]> {
    return await User.findAll({
      order: [["createdAt", "DESC"]],
    });
  }

  async findById(id: number): Promise<User | null> {
    return await User.findByPk(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }

  async findByProviderId(
    provider: "google" | "apple",
    providerId: string
  ): Promise<User | null> {
    return await User.findOne({
      where: { authProvider: provider, authProviderId: providerId },
    });
  }

  async create(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: "user" | "admin" = "user",
    authProvider: "local" | "google" | "apple" = "local",
    authProviderId: string | null = null,
    additionalFields: Partial<Pick<UserAttributes, "bio" | "avatarUrl" | "phoneNumber">> = {}
  ): Promise<User> {
    return await User.create({
      email,
      password,
      firstName,
      lastName,
      role,
      authProvider,
      authProviderId,
      ...additionalFields,
    });
  }

  // Update user
  async update(
    id: number,
    data: Partial<UserAttributes>
  ): Promise<User | null> {
    const user = await User.findByPk(id);
    if (!user) return null;

    await user.update(data);
    return user;
  }

  // Delete user
  async delete(id: number): Promise<User | null> {
    const user = await User.findByPk(id);
    if (!user) return null;

    await user.destroy();
    return user;
  }

  // Verify email
  async verifyEmail(id: number): Promise<User | null> {
    const user = await User.findByPk(id);
    if (!user) return null;

    user.isVerified = true;
    await user.save();
    return user;
  }
}

export const userModel = new UserModel();
