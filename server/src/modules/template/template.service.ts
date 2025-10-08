import { Injectable } from "@nestjs/common";
import { EnvService } from "@/modules//env/env.service";

import * as templates from "@/templates/notification.templates";

@Injectable()
export class TemplateService {
  constructor(private readonly env: EnvService) {}

  private readonly templateFactory: Record<
    NotificationPurpose,
    (data: any, env: EnvService) => TemplateReturn
  > = {
    signin: templates.signinTemplate,
    signup: templates.signupTemplate,
    verifyIdentifier: templates.verifyIdentifierTemplate,
    setPassword: templates.setPasswordTemplate,
    resetPassword: templates.resetPasswordTemplate,
    changeIdentifierReq: templates.changeIdentifierReqTemplate,
    changeIdentifier: templates.changeIdentifierTemplate,
    verifyMfa: templates.verifyMfaTemplate,
    enableMfaReq: templates.enableMfaReqTemplate,
    enableMfa: templates.enableMfaTemplate,
    disableMfaReq: templates.disableMfaReqTemplate,
    disableMfa: templates.disableMfaTemplate,
    orderStatus: templates.orderStatusTemplate,
  };

  resolveTemplate(purpose: NotificationPurpose, metadata: any): TemplateReturn {
    const templateFn = this.templateFactory[purpose];
    if (!templateFn) {
      throw new Error(`Undefined template purpose: ${purpose}`);
    }

    return templateFn(metadata, this.env);
  }
}
