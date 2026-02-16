import type { InviteEmailTemplateInput } from '../../types/inviteMember.type.ts'

export function generateInviteEmailTemplate({
  inviterEmail,
  workspaceName,
  role,
  inviteLink,
  expiresAt,
}: InviteEmailTemplateInput) {
  return `
  <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Workspace Invitation</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>

<body style="margin:0; padding:0; background-color:#f3f5f7; font-family: Arial, Helvetica, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" style="padding: 40px 16px;">

        <table width="600" cellpadding="0" cellspacing="0" border="0"
          style="max-width:600px; background:#ffffff; border-radius:12px; padding:36px; box-shadow:0 6px 24px rgba(0,0,0,0.06);">

          <tr>
            <td align="center">
              <h1 style="margin:0; font-size:26px; color:#111;">
                TeamPoint
              </h1>
              <p style="margin:6px 0 0; font-size:13px; color:#777;">
                Team Management Workspace
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding-top:28px;">
              <h2 style="margin:0; font-size:22px; color:#222;">
                You're invited to join a workspace 🚀
              </h2>
            </td>
          </tr>

          <tr>
            <td style="padding-top:16px; font-size:15px; color:#555; line-height:1.6;">
              <strong>${inviterEmail}</strong> has invited you to join the workspace
              <strong>${workspaceName}</strong> on TeamPoint.
              <br><br>

              Your assigned role:
            </td>
          </tr>

          <tr>
            <td style="padding-top:12px;">
              <span style="
                display:inline-block;
                background:#eef2ff;
                color:#3730a3;
                padding:8px 14px;
                border-radius:999px;
                font-size:13px;
                font-weight:bold;
                letter-spacing:0.3px;
              ">
                ${role}
              </span>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:32px 0 24px 0;">
              <a href="${inviteLink}"
                style="
                  background:#2563eb;
                  color:#ffffff;
                  text-decoration:none;
                  padding:14px 28px;
                  border-radius:8px;
                  font-size:16px;
                  font-weight:bold;
                  display:inline-block;
                ">
                Accept Invitation
              </a>
            </td>
          </tr>

          <tr>
            <td style="font-size:13px; color:#777; line-height:1.5;">
              If the button doesn’t work, copy and paste this link into your browser:
              <br><br>
              <span style="word-break:break-all; color:#444;">
                ${inviteLink}
              </span>
            </td>
          </tr>

<tr>
  <td align="center" style="padding:8px 0 20px 0;">
    <div style="
      display:inline-block;
      background:#fff7ed;
      color:#9a3412;
      padding:10px 16px;
      border-radius:8px;
      font-size:13px;
      border:1px solid #fed7aa;
    ">
      ⏳ This invitation expires on <strong>${expiresAt}</strong>
    </div>
  </td>
</tr>


          <tr>
            <td style="padding-top:22px; font-size:12px; color:#999;">
              This invitation link is personal and should not be shared.
            </td>
          </tr>

          <tr>
            <td style="padding-top:28px; border-top:1px solid #eee; font-size:12px; color:#999; line-height:1.6;">
              If you weren’t expecting this invite, you can safely ignore this email.
              <br><br>
              — TeamPoint Team
            </td>
          </tr>

        </table>

        <table width="600" style="max-width:600px;">
          <tr>
            <td align="center" style="padding:18px; font-size:12px; color:#aaa;">
              © TeamPoint. All rights reserved.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`
}
