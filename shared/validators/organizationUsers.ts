import Joi from "joi";

export const OrgUserStateEnum = ["pending", "accepted", "rejected"] as const;

export const OrganizationUserValidation = Joi.object({
  userId: Joi.string().required(),
  orgId: Joi.string().required(),
  state: Joi.string()
    .valid(...OrgUserStateEnum)
    .required(),
  reason: Joi.string().when("state", {
    is: "rejected",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});
