const { Schema, model } = require('mongoose');
const baseFieldsSchema = require('./BaseFields.model');

const groupSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
    description: {
      type: Schema.Types.String,
      trim: true,
    },
    is_private: {
      type: Schema.Types.Boolean,
      default: false,
    },
    organization_id: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      default: null,
    },
    ...baseFieldsSchema.obj,
  },
  {
    collection: 'Group_Master',
    timestamps: true,
  }
);

const Group = model('Group', groupSchema);

module.exports = Group;
