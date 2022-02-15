import * as TextHelpers from '../src/TextHelpers'
import moment from 'moment-timezone'

describe('sanitizeHTML', () => {
  it('returns empty string if called without text', () => {
    expect(TextHelpers.sanitizeHTML()).toBe('')
  })

  it('allows whitelist to be undefined', () => {
    expect(TextHelpers.sanitizeHTML('foo')).toBe('foo')
  })

  it('strips leading whitespace in paragraphs', () => {
    expect(TextHelpers.sanitizeHTML('<p>&nbsp;</p>')).toBe('<p></p>')
  })

  it('removes tags not on a whitelist', () => {
    const expected = 'Wombats are great.<div>They poop square.</div>'
    const unsafe = 'Wombats are great.<em>So great.</em><div>They poop square.</div>'
    const actual = TextHelpers.sanitizeHTML(unsafe, { allowedTags: ['div'] })
    expect(actual).toBe(expected)
  })

  it('removes attributes not on a whitelist', () => {
    const expected = '<p id="wombat-data">Wombats are great.</p>'
    const unsafe = '<p id="wombat-data" class="main-wombat">Wombats are great.</p>'
    const actual = TextHelpers.sanitizeHTML(unsafe, { allowTags: ['p'], allowedAttributes: { p: ['id'] } })
    expect(actual).toBe(expected)
  })
})

describe('truncateHTML', () => {
  it('has an ellipses after truncation', () => {
    expect(TextHelpers.truncateHTML('<a href="">test</a> test test', 5)).toBe('<a href="">test</a> …')
  })

  it('does not have an ellipses if there was no truncation', () => {
    expect(TextHelpers.truncateHTML('<a href="">test</a> test test', 100)).toBe('<a href="">test</a> test test')
  })
})

describe('truncateText', () => {
  it('has an ellipses after truncation', () => {
    expect(TextHelpers.truncateText('<I mean it> test test test', 8)).toBe('<I mean …')
  })

  it('does not have an ellipses if there was no truncation', () => {
    expect(TextHelpers.truncateText('<I mean it> test test test', 100)).toBe('<I mean it> test test test')
  })
})

describe('textLengthHTML', () => {
  it('should return lenght of plain text version of the html', () => {
    expect(TextHelpers.textLengthHTML('<strong>test</strong> <a href="">a link</a>')).toBe(11)
  })
})

describe('markdown', () => {
  it('converts to markdown', () => {
    expect(TextHelpers.markdown('*strong* **italic**')).toBe('<p><em>strong</em> <strong>italic</strong></p>\n')
  })

  it('sanitizes also', () => {
    expect(TextHelpers.markdown('*strong* **italic** <i>aa</i>')).toBe('<p><em>strong</em> <strong>italic</strong> </p>\n')
  })
})

describe('htmlToText', () => {
  it("shouldn't include text of href on links", () => {
    expect(TextHelpers.htmlToText("<a href='/any/url'>Text</a> more text")).toBe('Text more text')
  })
})

describe('formatDatePair', () => {
  it('displays differences of dates', () => {
    const d1 = moment.tz(1551908483315, 'Etc/GMT').month(1).day(1).hour(18)
    const d2 = moment.tz(d1, 'Etc/GMT').hour(21)
    const d3 = moment.tz(d2, 'Etc/GMT').day(2)
    const d4 = moment.tz(d3, 'Etc/GMT').month(2)
    const d5 = moment.tz(d3, 'Etc/GMT').year(2050)

    expect(TextHelpers.formatDatePair(d1)).toMatchSnapshot()
    expect(TextHelpers.formatDatePair(d1, d2)).toMatchSnapshot()
    expect(TextHelpers.formatDatePair(d1, d3)).toMatchSnapshot()
    expect(TextHelpers.formatDatePair(d1, d4)).toMatchSnapshot()
    expect(TextHelpers.formatDatePair(d1, d5)).toMatchSnapshot()
  })
})