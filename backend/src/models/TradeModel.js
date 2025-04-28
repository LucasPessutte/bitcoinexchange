import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Trade extends Model {
    static associate(models) {
      Trade.belongsTo(models.User, {
        foreignKey: 'buyer_id',
        as: 'buyer',
      });

      Trade.belongsTo(models.User, {
        foreignKey: 'seller_id',
        as: 'seller',
      });
    }
  }

  Trade.init({
    buyer_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    seller_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    createdAt: {
        field: 'created_at',
        type: DataTypes.DATE,
    },
    updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE,
    }
  }, {
    sequelize,
    modelName: 'Trade',
    tableName: 'trades',
    timestamps: true
  });

  return Trade;
};
