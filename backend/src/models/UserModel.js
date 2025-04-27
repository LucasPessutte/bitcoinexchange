import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Order, {
        foreignKey: 'user_id',
      });

      User.hasMany(models.Trade, {
        foreignKey: 'buyer_id',
        as: 'buyTrades',
      });

      User.hasMany(models.Trade, {
        foreignKey: 'seller_id',
        as: 'sellTrades',
      });
    }

    // Método de instância para comparar senha
    async validPassword(password) {
      return bcrypt.compare(password, this.password);
    }
  }

  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    usd_balance: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    btc_balance: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true
  });

  return User;
};
