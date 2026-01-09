export const detectIntent = (text) => {
  const msg = text.toLowerCase()

  if (msg.includes("add client")) {
    return { intent: "ADD_CLIENT", name: extractName(msg) }
  }

  if (msg.includes("pending payments")) {
    return { intent: "SHOW_PAYMENTS" }
  }

  if (msg.includes("open calendar")) {
    return { intent: "OPEN_CALENDAR" }
  }

  if (msg.includes("this week")) {
    return { intent: "WEEK_PROGRESS" }
  }

  return { intent: "UNKNOWN" }
}

const extractName = (msg) => {
  const match = msg.match(/named\s+([a-z]+)/)
  return match ? match[1] : null
}
