import Joi from "joi";

export const ContactValidation = Joi.object({
  entityId: Joi.string().required(),
  entityType: Joi.string().valid("user", "organization").required(),
  contact: Joi.string().required(),
  type: Joi.string().valid("email", "phone", "fax", "other").required(),
});
