import { EPISODE, HotstarTitle, HYPHEN, SEASON, SPACE } from "./hotstar";

const mockData = {
  "mf": {
    title: "Modern Family Season 5 Episode 15 on Disney+ Hotstar",
    url: "https://www.hotstar.com/in/tv/modern-family/8549/the-feud/1770001055"
  }
}

describe("url tests", () => {
  const { url, title } = mockData.mf;
	const hotStarTitle = new HotstarTitle(url, title);
  it('formatted string should not contain any spaces', () => {
    const formattedString = hotStarTitle.formatString(url);
    expect(formattedString.search(SPACE) === -1).toBeTruthy();
  })
  it('formatted series name should not contain hyphen', () => {
    expect(hotStarTitle.getSeriesName(url).search(HYPHEN) === -1).toBeTruthy();
  })
  it('should be episode tab when the last url value is a number', () => {
    expect(hotStarTitle.isEpisodeTab(url)).toBeTruthy();
  })
})

describe("title tests", () => {
  const { url, title } = mockData.mf;
  const hotStarTitle = new HotstarTitle(url, title);
  it('should correctly get the season number', () => {
    const seasonNumber = hotStarTitle.getNumbersFromTitle(SEASON, hotStarTitle.formatString(title))
    expect(seasonNumber).toBe(5);
  })
  it('should correctly get the episode number', () => {
    const seasonNumber = hotStarTitle.getNumbersFromTitle(EPISODE, hotStarTitle.formatString(title))
    expect(seasonNumber).toBe(15);
  })
})
