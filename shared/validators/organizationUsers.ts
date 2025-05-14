import Joi from "joi";

export const OrganizationUserValidation = Joi.object({
  userId: Joi.string().required(),
  orgId: Joi.string().required(),
  state: Joi.string().valid("pending", "accepted", "rejected").required(),
  reason: Joi.string().when("state", {
    is: "rejected",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});
