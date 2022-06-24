const DISCORD_ROLE_ID = process.env.DISCORD_ROLE_ID || ''
const DISCOURSE_URL = process.env.DISCOURSE_URL || ''

export const HIGH_IMPACT = 'impact-:-high'
export const MEDIUM_IMPACT = 'impact-:-medium'
export const regularReplyText = (impactType: string) =>
  `Attention @impact-alerts this proposal has been given a ${impactType} Impact tag, please consider reviewing it.\n\nIf you would like to sign up for impact alerts, please follow these [instructions](https://forum.makerdao.com)`
export const increasedImpactReplyText = `Attention @impact-alerts this proposal has been upgraded from Medium Impact to High Impact, please consider reviewing it.\n\nIf you would like to sign up for impact alerts, please follow these [instructions](https://forum.makerdao.com)`
export const discordEmbed = (title: string, impact: string, id: number) => ({
  title,
  description: `Attention <@${DISCORD_ROLE_ID}> this proposal has been given a ${impact} Impact tag, please consider reviewing it.\n\nIf you would like to sign up for impact alerts, please follow these [instructions](https://forum.makerdao.com)`,
  url: `${DISCOURSE_URL}/t/${id}`,
  color: 0x1aab9b,
})
