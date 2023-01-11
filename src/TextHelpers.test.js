import * as TextHelpers from '../src/TextHelpers'
import { DateTime } from 'luxon'

describe('presentHTMLToText', () => {
  it("shouldn't include text of href on links", () => {
    expect(TextHelpers.presentHTMLToText("<a href='/any/url'>Text</a> more text")).toBe('Text more text')
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
  it('converts to markdown with autolinking (default)', () => {
    expect(TextHelpers.markdown('https://www.hylo.com')).toBe('<p><a href="https://www.hylo.com">https://www.hylo.com</a></p>\n')
  })
  it('converts to markdown with disableAutolinking', () => {
    expect(TextHelpers.markdown('https://www.hylo.com', { disableAutolinking: true })).toBe('<p>https://www.hylo.com</p>\n')
  })
  it('converts to markdown in paragraphs', () => {
    expect(TextHelpers.markdown('asdw\n\n\nasdf')).toBe('<p>asdw</p>\n<p>asdf</p>\n')
  })
})

describe('formatDatePair', () => {
  it('displays differences of dates', () => {
    const d1 = DateTime.local(2019, 2, 4, 11, 41)
    const d2 = DateTime.local(2019, 2, 4, 14, 41)
    const d3 = DateTime.local(2019, 2, 5, 14, 41)
    const d4 = DateTime.local(2019, 3, 5, 14, 41)
    const d5 = DateTime.local(2050, 2, 5, 14, 41)
    const d6 = DateTime.local(DateTime.now().year, 2, 5, 14, 41)
    const d7 = DateTime.local(DateTime.now().year, 3, 5, 14, 41)

    expect(TextHelpers.formatDatePair(d1)).toMatchSnapshot()
    expect(TextHelpers.formatDatePair(d1, d2)).toMatchSnapshot()
    expect(TextHelpers.formatDatePair(d1, d3)).toMatchSnapshot()
    expect(TextHelpers.formatDatePair(d1, d4)).toMatchSnapshot()
    expect(TextHelpers.formatDatePair(d1, d5)).toMatchSnapshot()
    expect(TextHelpers.formatDatePair(d1, d6)).toMatchSnapshot()
    expect(TextHelpers.formatDatePair(d6, d5)).toMatchSnapshot()
    expect(TextHelpers.formatDatePair(d6, d7)).toMatchSnapshot()
  })
})

describe('sanitizeURL', () => {
  it('adds "https" when no protocol specified', () => {
    expect(TextHelpers.sanitizeURL('www.hylo.com')).toBe('https://www.hylo.com')
  })
})
