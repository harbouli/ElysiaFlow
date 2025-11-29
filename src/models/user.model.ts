import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import bcrypt from "bcrypt";

export interface UserAttributes {
  id: number;
  email: string;
  password: string;
  name: string;
  role: "user" | "admin";
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "role" | "isVerified"> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: number;
  declare email: string;
  declare password: string;
  declare name: string;
  declare role: "user" | "admin";
  declare isVerified: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  // Method to compare passwords
  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  // Method to exclude password from JSON
  public toJSON(): Omit<UserAttributes, "password"> {
    const { password, ...values } = this.get();
    return values as Omit<UserAttributes, "password">;
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name cannot be empty",
        },
      },
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
      allowNull: false,
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
      // Hash password before creating user
      beforeCreate: async (user: User) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      // Hash password before updating if it changed
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
  // Find all users (excluding passwords)
  async findAll(): Promise<User[]> {
    return await User.findAll({
      order: [["createdAt", "DESC"]],
    });
  }

  // Find user by ID
  async findById(id: number): Promise<User | null> {
    return await User.findByPk(id);
  }

  // Find user by email
  async findByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }

  // Create new user
  async create(
    email: string,
    password: string,
    name: string,
    role: "user" | "admin" = "user"
  ): Promise<User> {
    return await User.create({ email, password, name, role });
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
