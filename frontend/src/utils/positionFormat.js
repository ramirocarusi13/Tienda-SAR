export const RACK_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
export const RACK_ROW_LABELS = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X'
]
export const RACK_ROW_NUMBERS = Array.from({ length: 34 }, (_, idx) => idx + 1)
export const RACK_LEVELS = [0, 1, 2, 3, 4]

export const normalizePositionText = (value) => String(value || '')
    .trim()
    .toUpperCase()
    .replace(/'/g, '-')

const parseRackPosition = (value) => {
    const normalized = normalizePositionText(value)
    const parts = normalized.split('-')

    if (parts.length !== 3) {
        return null
    }

    const [rack, rowToken, level] = parts

    if (!/^[A-H]$/.test(rack) || !/^[0-4]$/.test(level)) {
        return null
    }

    if (/^(?:[1-9]|[12]\d|3[0-4])$/.test(rowToken)) {
        return { rack, rowToken, level: Number(level) }
    }

    if (/^[A-X]$/.test(rowToken)) {
        return { rack, rowToken, level: Number(level) }
    }

    return null
}

export const isValidRackPosition = (value) => Boolean(parseRackPosition(value))

export const toCanonicalRackPosition = (value) => {
    const parsed = parseRackPosition(value)
    if (!parsed) {
        return null
    }

    return `${parsed.rack}-${parsed.rowToken}-${parsed.level}`
}

export const areEquivalentRackPositions = (left, right) => {
    const leftCanonical = toCanonicalRackPosition(left)
    const rightCanonical = toCanonicalRackPosition(right)

    if (leftCanonical && rightCanonical) {
        return leftCanonical === rightCanonical
    }

    return normalizePositionText(left) === normalizePositionText(right)
}
