export const formatUzPhone = (value) => {
    let digits = value.replace(/\D/g, '')
  
    // Always start with 998
    if (!digits.startsWith('998')) {
      digits = '998'
    }
  
    digits = digits.slice(0, 12)
  
    const p1 = digits.slice(3, 5)
    const p2 = digits.slice(5, 8)
    const p3 = digits.slice(8, 10)
    const p4 = digits.slice(10, 12)
  
    let formatted = '+998'
    if (p1) formatted += ` ${p1}`
    if (p2) formatted += ` ${p2}`
    if (p3) formatted += ` ${p3}`
    if (p4) formatted += ` ${p4}`
  
    return formatted
  }
  