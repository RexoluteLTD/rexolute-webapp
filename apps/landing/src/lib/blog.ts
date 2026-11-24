import type { JSONContent } from "@tiptap/core";

export const blogCategories = [
  "Parenting", "Addiction", "Anxiety", "Depression", "Work-life balance",
  "Relationship", "Coping strategies", "Stress management",
] as const;

export type BlogCategory = typeof blogCategories[number];

interface BlogImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  relatedCategory?: BlogCategory;
  author: { name: string; avatar: string };
  publishedAt: string;
  image: BlogImage;
  readingMinutes: number;
  content: JSONContent;
}

const imageRoot = "/images/blog";
const authors = {
  jason: { name: "Jason Francisco", avatar: `${imageRoot}/jason.webp` },
  elizabeth: { name: "Elizabeth Slavin", avatar: `${imageRoot}/elizabeth.webp` },
  eric: { name: "Eric Smith", avatar: `${imageRoot}/eric.webp` },
  tracey: { name: "Tracey Wilson", avatar: `${imageRoot}/tracey.webp` },
  ernie: { name: "Ernie Smith", avatar: `${imageRoot}/ernie.webp` },
};

const thumbnail = (name: string, alt: string): BlogImage => ({
  src: `${imageRoot}/${name}.webp`, alt, width: 710, height: 470,
});

const paragraph = (text: string): JSONContent => ({ type: "paragraph", content: [{ type: "text", text }] });
const heading = (text: string): JSONContent => ({ type: "heading", attrs: { level: 2 }, content: [{ type: "text", text }] });
const document = (...content: JSONContent[]): JSONContent => ({ type: "doc", content });

export const featuredBlogImage: BlogImage = {
  src: `${imageRoot}/workplace-hero.webp`,
  alt: "A woman using a tablet beside blue-lit server racks",
  width: 1600,
  height: 800,
};

export const featuredBlogPost: BlogPost = {
  slug: "finding-work-life-balance-with-technology",
  title: "The impact of technology on the workplace: Finding work-life balance",
  excerpt: "Notifications can make it hard to switch off. Learn how small digital boundaries can make more room for life outside work.",
  category: "Stress management",
  relatedCategory: "Work-life balance",
  author: authors.jason,
  publishedAt: "2022-08-20",
  image: {
    src: `${imageRoot}/workplace-article.webp`,
    alt: "The Hungarian Parliament Building lit up beside the Danube at dusk",
    width: 1400,
    height: 805,
  },
  readingMinutes: 3,
  content: document(
    paragraph("A message you can answer in ten seconds can still pull your attention back to work for the rest of the evening. When the same device holds your calendar, family group chat and work inbox, switching off often takes a deliberate step."),
    paragraph("Useful boundaries depend on the work you do and the people who rely on you. A shared understanding of when you’re available can make more difference than turning off every notification."),
    heading("Notice what breaks your focus"),
    paragraph("For a day or two, observe when you reach for your phone or jump to a message. Are you responding to something urgent, or reacting to an alert? Look for a pattern you can change without making work harder for you or your teammates."),
    heading("Agree on when to respond"),
    paragraph("Talk with your team about what counts as urgent and which channel to use when something needs immediate attention. A clear agreement lets people step away with more confidence and makes it easier to identify the messages that really do need a fast reply."),
    paragraph("If your hours are irregular, set an availability note with the time you expect to be back. Give colleagues a way to reach the right person if something comes up while you’re away."),
    { type: "blockquote", content: [paragraph("A useful boundary gives the people around you enough information to plan without you.")] },
    heading("Create an end-of-day routine"),
    paragraph("Before you close your laptop, write down what needs your attention next. Pick one small task to start with tomorrow. Leaving yourself a short note can make it easier to close open tabs and let the rest of the evening belong to you."),
    heading("Try one change for a week"),
    paragraph("Choose a single adjustment, such as silencing one channel after work or making the first half hour of the morning meeting-free. After a week, look at when it helped and where it got in the way. Keep what fits the way you work."),
  ),
};

export const blogPosts: BlogPost[] = [
  {
    slug: "making-room-for-conversations-at-home",
    title: "Making room for difficult conversations at home",
    excerpt: "Small ways to make it easier for children to talk about what’s on their minds.",
    category: "Parenting", author: authors.jason, publishedAt: "2022-08-20",
    image: thumbnail("parenting", "Three people standing together with hands on one another’s shoulders"),
    readingMinutes: 1,
    content: document(
      paragraph("Some children find it easier to talk while their hands are busy. A walk, a lift home or a few minutes cooking together can offer an opening with less pressure than a planned sit-down conversation."),
      heading("Make it easy to start"),
      paragraph("Ask about something specific you noticed and give them time to answer. Try listening through the first pause before offering advice. When the conversation ends, remind them they can bring it up again later."),
    ),
  },
  {
    slug: "unplugging-after-work",
    title: "Unplugging after work when your office comes home",
    excerpt: "Build a transition between the end of the workday and the rest of your evening.",
    category: "Work-life balance", author: authors.elizabeth, publishedAt: "2022-08-20",
    image: thumbnail("unplugging", "Close-up of a person sitting with their hands clasped"),
    readingMinutes: 1,
    content: document(
      paragraph("Without a commute, the end of the workday can pass without a clear signal. Picking a small routine, such as putting your laptop away and taking a short walk, gives you a way to mark that transition."),
      heading("Make tomorrow’s first task clear"),
      paragraph("Write down where you stopped and what you’ll open first in the morning. A two-line note can be enough to help you leave the task where it is for the evening."),
    ),
  },
  {
    slug: "showing-up-for-someone-having-a-hard-week",
    title: "How to show up for someone having a hard week",
    excerpt: "Offer practical support and let the person decide what would help.",
    category: "Depression", author: authors.eric, publishedAt: "2022-08-20",
    image: thumbnail("showing-up", "Two people embracing in a room full of chairs"),
    readingMinutes: 1,
    content: document(
      paragraph("A specific offer can be easier to respond to than an open-ended one. You might ask whether they’d like a short call, company on a walk or help picking up something from the shops."),
      heading("Leave room for their answer"),
      paragraph("Give the person time and space to choose. If they don’t feel up to spending time together, tell them you’re thinking of them and ask whether they’d like you to check in later."),
    ),
  },
  {
    slug: "listening-without-jumping-to-solutions",
    title: "Listening without jumping straight to solutions",
    excerpt: "A useful question to ask when someone comes to you with a problem.",
    category: "Relationship", author: authors.tracey, publishedAt: "2022-08-20",
    image: thumbnail("listening", "A small group talking at a café table"),
    readingMinutes: 1,
    content: document(
      paragraph("When someone tells you about a difficult day, you might already be thinking about how to fix the problem. Start by giving their story your attention and reflecting back one thing you heard."),
      heading("Ask what kind of help they want"),
      paragraph("You can ask, “Would you like my thoughts, or would it help to talk it through?” Their answer takes some of the guesswork out of the conversation."),
    ),
  },
  {
    slug: "finding-a-routine-during-change",
    title: "Finding a steady routine during a period of change",
    excerpt: "Choose a manageable daily activity that fits your current circumstances.",
    category: "Addiction", relatedCategory: "Coping strategies", author: authors.elizabeth, publishedAt: "2022-08-20",
    image: thumbnail("daily-routines", "Two singing bowls beside a glass vase"),
    readingMinutes: 1,
    content: document(
      paragraph("During a period of change, familiar activities can give your day some structure. Preparing breakfast, walking with a friend or putting tomorrow’s clothes out can be a simple place to start."),
      heading("Keep it manageable"),
      paragraph("Choose an activity you can do on an ordinary day. If you’re changing a routine as part of a recovery plan, use the plan you’ve made with your support team to decide what fits."),
    ),
  },
  {
    slug: "slowing-down-a-busy-day",
    title: "Small ways to slow down when the day feels too full",
    excerpt: "Notice what needs your attention now and make a plan for what can wait.",
    category: "Stress management", relatedCategory: "Anxiety", author: authors.ernie, publishedAt: "2022-08-20",
    image: thumbnail("slowing-down", "A woman in blue framed by hands reaching in from both sides"),
    readingMinutes: 1,
    content: document(
      paragraph("On a busy day, everything can feel like it needs your attention at once. A short list can help you see which task is next, which one has a deadline and which can wait until you have more time."),
      heading("Leave a little space between tasks"),
      paragraph("When your schedule allows, keep a few minutes clear between commitments. Use them to finish a note, get a drink of water or decide whether the next task still needs to happen today."),
    ),
  },
];

export const allBlogPosts = [featuredBlogPost, ...blogPosts];
export const findBlogPost = (slug: string) => allBlogPosts.find((post) => post.slug === slug);
export const formatBlogDate = (date: string) => new Intl.DateTimeFormat("en-US", {
  month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
}).format(new Date(date));
