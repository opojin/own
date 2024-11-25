const { type, name } = $arguments
const compatible_outbound = {
  tag: 'COMPATIBLE',
  type: 'direct',
}

let compatible
let config = JSON.parse($files[0])
let proxies = await produceArtifact({
  name,
  type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
  platform: 'sing-box',
  produceType: 'internal',
})

config.outbounds.push(...proxies)

config.outbounds.map(i => {
  if (['all'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies))
  }
  if (['sg'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /^(?!.*(?:us)).*(新|claw|sg|singapore|🇸🇬)/i))
  }
  if (['openai'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /美|rack|dmit|claw|台|TW|unitedstates|united states|德|uk|法|英|🇺🇸/i))
  }
  if (['us'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /美|rack|dmit|unitedstates|united states|德|uk|法|英|🇺🇸/i))
  }
})

config.outbounds.forEach(outbound => {
  if (Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0) {
    if (!compatible) {
      config.outbounds.push(compatible_outbound)
      compatible = true
    }
    outbound.outbounds.push(compatible_outbound.tag);
  }
});

$content = JSON.stringify(config, null, 2)

function getTags(proxies, regex) {
  return (regex ? proxies.filter(p => regex.test(p.tag)) : proxies).map(p => p.tag)
}
