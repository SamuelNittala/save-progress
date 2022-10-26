import { HotstarTitle, HYPHEN, SPACE } from "./hotstar";

const mockData = {
  "episode": {
    title: "Modern Family Season 5 Episode 15 on Disney+ Hotstar",
    url: "https://www.hotstar.com/in/tv/modern-family/8549/the-feud/1770001055"
  }
}

describe("url tests", () => {
  const { url, title } = mockData.episode;
	const hotStarTitle = new HotstarTitle(url, title);
  it('formatted string should not contain any spaces', () => {
    const formattedString = hotStarTitle.formatString(url);
    expect(formattedString.search(SPACE) === -1).toBeTruthy();
  })
  it('formatted series name should not contain hyphen', () => {
    expect(hotStarTitle.getSeriesName(url).search(HYPHEN) === -1).toBeTruthy();
  })
})
