import type * as React from 'react';

/** The three brand families. Each sets --tone (the brand fill) with --on-tone (white on chilli and blue, ink on sun),
 *  --tone-strong (badge solid), --tone-tint (the cream band) and --tone-deep (text-safe colour) via the kh-tone-* classes.
 *  chilli = the logo's orange, blue = Kheelu Blue (the logo's sky), sun = Sunshine. The v1 names (pink, peach, sky, mint, lilac) still work as aliases. */
export type Tone = 'chilli' | 'blue' | 'sun';
/** One of the 76 Phosphor Bold icons bundled in Kheelona.ICON_NAMES. */
export type IconName = string;

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** cta = chilli (orange, white text), buying only, one per view. primary = Kheelu Blue with white text, the main everyday action. secondary = ink outline.
   *  ghost = underlined text. danger = red outline (a red fill only inside a Dialog). Default secondary. */
  variant?: 'cta' | 'primary' | 'secondary' | 'ghost' | 'danger';
  /** s = 40px with a 48px tap area, m = 48px (default), l = 56px with kh-label-l text. */
  size?: 's' | 'm' | 'l';
  icon?: IconName;
  iconEnd?: IconName;
  /** Renders an <a> when set. */
  href?: string;
  block?: boolean;
  /** Shows a spinner, sets aria-busy and disables the button. Keep the label. */
  loading?: boolean;
  tone?: Tone;
  children?: React.ReactNode;
}
export declare function Button(props: ButtonProps): React.ReactElement;

export interface StickerProps {
  tone?: Tone;
  /** Degrees of tilt, default -3. Keep between -8 and +6. */
  tilt?: number;
  icon?: IconName;
  /** Kalam lettering. */
  hand?: boolean;
  /** Round burst; pair with `big`. */
  round?: boolean;
  big?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}
export declare function Sticker(props: StickerProps): React.ReactElement;

export interface SectionHeadingProps {
  eyebrow?: React.ReactNode;
  /** A string or nodes; use Hand or Mark for one accent. */
  title?: React.ReactNode;
  lead?: React.ReactNode;
  align?: 'left' | 'center';
  /** 40px on phones, 56px from 768px, 72px from 1024px (display-m, -l, -xl). Once per page. */
  hero?: boolean;
  level?: 1 | 2 | 3;
  tone?: Tone;
  children?: React.ReactNode;
  className?: string;
}
export declare function SectionHeading(props: SectionHeadingProps): React.ReactElement;
export declare function Hand(props: { tone?: Tone; children?: React.ReactNode }): React.ReactElement;
export declare function Mark(props: { tone?: Tone; kind?: 'underline' | 'highlight' | 'circle'; children?: React.ReactNode }): React.ReactElement;

export interface FeatureCardProps {
  tone?: Tone;
  variant?: 'plain' | 'tint' | 'block';
  icon?: IconName;
  title: React.ReactNode;
  children?: React.ReactNode;
  link?: { href: string; label: string };
  className?: string;
}
export declare function FeatureCard(props: FeatureCardProps): React.ReactElement;

export interface StepLoopProps { steps: { title: React.ReactNode; body: React.ReactNode; tone?: Tone }[]; className?: string }
export declare function StepLoop(props: StepLoopProps): React.ReactElement;

export interface AgeTimelineProps { items: { age: string; title: React.ReactNode; body: React.ReactNode; note?: React.ReactNode; tone?: Tone }[]; className?: string }
export declare function AgeTimeline(props: AgeTimelineProps): React.ReactElement;

export type Feeling = 'curious' | 'grumpy' | 'sad' | 'silly' | 'joy';
export interface FeelingChipProps {
  feeling: Feeling; card?: boolean; label?: string; description?: string;
  /** Colours the face dot with a brand fill. Default: a cream dot with an ink face. */
  tone?: Tone; className?: string
}
export declare function FeelingChip(props: FeelingChipProps): React.ReactElement;

export interface Language { native: string; english?: string; lang?: string; soon?: boolean }
export interface LanguageChipsProps { languages?: Language[]; className?: string }
export declare function LanguageChips(props: LanguageChipsProps): React.ReactElement;

export interface FAQProps { items: { q: React.ReactNode; a: React.ReactNode; open?: boolean }[]; className?: string }
export declare function FAQ(props: FAQProps): React.ReactElement;

export interface OfferCardProps {
  product?: string;
  /** Rupees. Defaults reflect the 8 Oct 2026 offer: 4999 / 7999 / 499. */
  price?: number;
  was?: number;
  deposit?: number;
  balance?: number;
  shipDate?: string;
  perks?: string[];
  /** Sticker text, or false to hide. */
  sticker?: string | false;
  cta?: string;
  href?: string;
  fine?: string;
  /** Only from live inventory. */
  unitsLeft?: number;
  unitsTotal?: number;
  className?: string;
}
export declare function OfferCard(props: OfferCardProps): React.ReactElement;

export interface AnnouncementBarProps { items: string[]; link?: { href: string; label: string }; className?: string }
export declare function AnnouncementBar(props: AnnouncementBarProps): React.ReactElement;

export interface StickyBuyBarProps { price?: string; note?: string; cta?: string; href?: string; className?: string }
export declare function StickyBuyBar(props: StickyBuyBarProps): React.ReactElement;

export interface ComparisonTableProps {
  columns: string[];
  rows: { label: React.ReactNode; values: string[] }[];
  usIndex?: number;
  caption?: string;
  firstColumn?: string;
  className?: string;
}
export declare function ComparisonTable(props: ComparisonTableProps): React.ReactElement;

export interface TrustListProps { items: { icon?: IconName; title: React.ReactNode; body: React.ReactNode }[]; className?: string }
export declare function TrustList(props: TrustListProps): React.ReactElement;

export interface TestimonialProps { quote?: React.ReactNode; name: string; role?: string; city?: string; tone?: Tone; children?: React.ReactNode; className?: string }
export declare function Testimonial(props: TestimonialProps): React.ReactElement;

export interface Doodle {
  src: string; x: number; y: number; w: number; rotate?: number;
  /** CSS clip-path in % of the doodle, e.g. "polygon(...)": hides the part that passes behind something in front of the child, such as Kheelu in their arms. */
  clip?: string;
}
export interface ImaginationFrameProps {
  variant?: 'board' | 'photo';
  /** Ink question text, for light photos. */
  ink?: boolean;
  photo?: string;
  cutout?: string;
  cutoutStyle?: React.CSSProperties;
  alt?: string;
  question?: React.ReactNode;
  questionAlign?: 'center' | 'left';
  doodles?: Doodle[];
  tone?: Tone;
  style?: React.CSSProperties;
  className?: string;
}
export declare function ImaginationFrame(props: ImaginationFrameProps): React.ReactElement;

export interface CastCardProps { name: string; age: string; city?: string; languages?: string; line?: string; photo?: string; tone?: Tone; alt?: string; className?: string }
export declare function CastCard(props: CastCardProps): React.ReactElement;

export interface SocialPostProps {
  tone?: Tone;
  variant?: 'block' | 'fur' | 'board';
  eyebrow?: string;
  headline: React.ReactNode;
  hand?: React.ReactNode;
  sub?: React.ReactNode;
  kid?: string;
  kidAlt?: string;
  product?: string;
  shape?: { src: string; x: number; y: number; w: number };
  brand?: string;
  /** Pill text, or false to hide. */
  offer?: string | false;
  label?: string;
  className?: string;
}
export declare function SocialPost(props: SocialPostProps): React.ReactElement;

export interface DeckSlideProps {
  layout?: 'title' | 'statement' | 'facts';
  tone?: Tone;
  board?: boolean;
  eyebrow?: string;
  title: React.ReactNode;
  hand?: React.ReactNode;
  sub?: React.ReactNode;
  kid?: string;
  product?: string;
  facts?: { num: React.ReactNode; label: React.ReactNode; tone?: Tone }[];
  foot?: React.ReactNode;
  label?: string;
  className?: string;
}
export declare function DeckSlide(props: DeckSlideProps): React.ReactElement;

export interface AppSummaryCardProps {
  title?: string;
  date?: string;
  stats?: { num: React.ReactNode; label: React.ReactNode; tone?: Tone }[];
  words?: string[];
  wordsLabel?: string;
  topics?: string[];
  topicsLabel?: string;
  tryTitle?: string;
  tryText?: React.ReactNode;
  link?: { href: string; label: string };
  className?: string;
}
export declare function AppSummaryCard(props: AppSummaryCardProps): React.ReactElement;

export interface ParentControlProps {
  items: { icon?: IconName; tone?: Tone; label: React.ReactNode; hint?: React.ReactNode; checked?: boolean; onChange?: React.ChangeEventHandler<HTMLInputElement> }[];
  label?: string;
  idPrefix?: string;
  className?: string;
}
export declare function ParentControl(props: ParentControlProps): React.ReactElement;

export interface ModeSwitchProps {
  modes?: { id: string; label: string; icon?: IconName }[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  label?: string;
  className?: string;
}
export declare function ModeSwitch(props: ModeSwitchProps): React.ReactElement;

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> { label: React.ReactNode; hint?: React.ReactNode; error?: React.ReactNode }
export declare function TextField(props: TextFieldProps): React.ReactElement;

export interface NavBarProps { links?: { label: string; href: string; current?: boolean }[]; cta?: { label: string; href: string }; brand?: string; homeHref?: string; drawerNote?: string; className?: string }
export declare function NavBar(props: NavBarProps): React.ReactElement;

export interface FooterProps { brand?: string; promise?: string; made?: string | false; columns?: { title: string; links: { label: string; href: string }[] }[]; legal?: string[]; className?: string }
export declare function Footer(props: FooterProps): React.ReactElement;

export interface IconProps { name: IconName; label?: string; className?: string; style?: React.CSSProperties }
export declare function Icon(props: IconProps): React.ReactElement | null;

/* ---------- Brand ---------- */
export interface LogoProps {
  /** auto, day and bedtime all draw the logo in its own orange and sky blue (it reads on cream and on night grounds).
   *  sticker adds the white cut-out outline. ink and chalk are one-colour. */
  variant?: 'auto' | 'day' | 'bedtime' | 'sticker' | 'ink' | 'chalk';
  /** The K only (app icon, favicon, avatar). */
  mark?: boolean;
  /** px number or any CSS length. Default 32. Minimum 20px for the full logo. */
  height?: number | string;
  /** Accessible name, default "Kheelona". */
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Logo(props: LogoProps): React.ReactElement;

/* ---------- Actions ---------- */
export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: IconName;
  /** Required accessible name (also the native tooltip). */
  label: string;
  variant?: 'ghost' | 'outline' | 'primary';
  /** s = 40px (48px tap area), m = 48px, l = 56px. */
  size?: 's' | 'm' | 'l';
  href?: string;
}
export declare function IconButton(props: IconButtonProps): React.ReactElement;

export interface MenuItem { label?: React.ReactNode; icon?: IconName; hint?: React.ReactNode; href?: string; onSelect?: (item: MenuItem) => void; danger?: boolean; disabled?: boolean; divider?: boolean }
export interface MenuProps {
  /** Button text. Omit it and pass icon + ariaLabel for an icon-only trigger. */
  label?: React.ReactNode;
  icon?: IconName;
  ariaLabel?: string;
  variant?: 'cta' | 'primary' | 'secondary' | 'ghost';
  size?: 's' | 'm' | 'l';
  items: MenuItem[];
  align?: 'start' | 'end';
  defaultOpen?: boolean;
  className?: string;
}
export declare function Menu(props: MenuProps): React.ReactElement;

/* ---------- Forms ---------- */
export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { label: React.ReactNode; hint?: React.ReactNode; error?: React.ReactNode }
export declare function TextArea(props: TextAreaProps): React.ReactElement;

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: React.ReactNode;
  options: (string | { value: string; label: React.ReactNode; disabled?: boolean })[];
  placeholder?: string;
  hint?: React.ReactNode;
  error?: React.ReactNode;
}
export declare function Select(props: SelectProps): React.ReactElement;

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> { label: React.ReactNode; hint?: React.ReactNode; indeterminate?: boolean }
export declare function Checkbox(props: CheckboxProps): React.ReactElement;

export interface RadioGroupProps {
  label?: React.ReactNode;
  name?: string;
  options: { value: string; label: React.ReactNode; hint?: React.ReactNode; disabled?: boolean }[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  inline?: boolean;
  className?: string;
}
export declare function RadioGroup(props: RadioGroupProps): React.ReactElement;

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> { label: React.ReactNode; hint?: React.ReactNode }
export declare function Switch(props: SwitchProps): React.ReactElement;

export interface TagProps { selected?: boolean; onClick?: React.MouseEventHandler<HTMLButtonElement>; onRemove?: React.MouseEventHandler<HTMLButtonElement>; icon?: IconName; children?: React.ReactNode; className?: string }
export declare function Tag(props: TagProps): React.ReactElement;

/* ---------- Feedback ---------- */
export type Status = 'info' | 'success' | 'warning' | 'danger';
export interface BadgeProps { tone?: Tone | 'success' | 'warning' | 'danger' | 'neutral'; variant?: 'soft' | 'solid'; icon?: IconName; children?: React.ReactNode; className?: string }
export declare function Badge(props: BadgeProps): React.ReactElement;

export interface AlertProps { tone?: Status; title?: React.ReactNode; children?: React.ReactNode; action?: { label: string; onClick?: () => void; href?: string }; onClose?: () => void; icon?: IconName; className?: string }
export declare function Alert(props: AlertProps): React.ReactElement;

export interface ToastProps { tone?: 'info' | 'success' | 'danger'; icon?: IconName; children?: React.ReactNode; action?: { label: string; onClick?: () => void }; onClose?: () => void; className?: string }
export declare function Toast(props: ToastProps): React.ReactElement;

export interface TooltipProps { label: React.ReactNode; placement?: 'top' | 'bottom'; open?: boolean; children: React.ReactElement; className?: string }
export declare function Tooltip(props: TooltipProps): React.ReactElement;

export interface EmptyStateProps { icon?: IconName; tone?: Tone; title: React.ReactNode; children?: React.ReactNode; action?: { label: string; variant?: ButtonProps['variant']; href?: string; onClick?: () => void }; className?: string }
export declare function EmptyState(props: EmptyStateProps): React.ReactElement;

export interface SpinnerProps { size?: number; label?: string; className?: string }
export declare function Spinner(props: SpinnerProps): React.ReactElement;

export interface ProgressBarProps {
  value: number; max?: number; label?: React.ReactNode; showValue?: boolean; valueText?: string;
  /** Kept for compatibility. Bars are always `primary` (Kheelu Blue); give the bar a label with showValue, or valueText, so the value is also written out. */
  tone?: 'blue' | 'chilli'; className?: string
}
export declare function ProgressBar(props: ProgressBarProps): React.ReactElement;

/* ---------- Overlays ---------- */
export interface DialogAction extends Omit<ButtonProps, 'children'> { label: React.ReactNode }
export interface DialogProps {
  open?: boolean;
  onClose?: () => void;
  title: React.ReactNode;
  children?: React.ReactNode;
  /** The last action is primary by default. A destructive final action uses variant "danger". */
  actions?: DialogAction[];
  /** Bottom-sheet style (phones). */
  sheet?: boolean;
  /** Render in the page instead of as a modal (docs, screenshots). */
  inline?: boolean;
  className?: string;
}
export declare function Dialog(props: DialogProps): React.ReactElement;
export declare function BottomSheet(props: Omit<DialogProps, 'sheet'>): React.ReactElement;

export interface NavDrawerProps {
  open?: boolean;
  onClose?: () => void;
  links?: { label: string; href: string; current?: boolean; icon?: IconName }[];
  cta?: { label: string; href: string };
  note?: React.ReactNode;
  homeHref?: string;
  label?: string;
  inline?: boolean;
  className?: string;
}
export declare function NavDrawer(props: NavDrawerProps): React.ReactElement | null;

/* ---------- Navigation and app ---------- */
export interface TabsProps {
  tabs: { id: string; label: React.ReactNode; icon?: IconName; count?: number; content?: React.ReactNode }[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  variant?: 'line' | 'pill';
  label?: string;
  className?: string;
}
export declare function Tabs(props: TabsProps): React.ReactElement;

export interface TabBarProps { items: { id: string; label: string; icon: IconName; href?: string; badge?: React.ReactNode }[]; value?: string; onChange?: (id: string) => void; label?: string; className?: string }
export declare function TabBar(props: TabBarProps): React.ReactElement;

export interface ListProps { as?: 'div' | 'ul' | 'ol' | 'section'; plain?: boolean; label?: string; role?: string; children?: React.ReactNode; className?: string }
export declare function List(props: ListProps): React.ReactElement;

export interface ListItemProps {
  icon?: IconName;
  tone?: Tone;
  avatar?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  meta?: React.ReactNode;
  end?: React.ReactNode;
  href?: string;
  onClick?: React.MouseEventHandler;
  chevron?: boolean;
  className?: string;
}
export declare function ListItem(props: ListItemProps): React.ReactElement;

export interface AvatarProps { name: string; src?: string; alt?: string; size?: 's' | 'm' | 'l' | 'xl'; tone?: Tone; className?: string }
export declare function Avatar(props: AvatarProps): React.ReactElement;

/** ₹ with Indian digit grouping: formatINR(100000) === "₹1,00,000". */
export declare function formatINR(n: number): string;

declare global {
  interface Window {
    Kheelona: {
      Button: typeof Button; Sticker: typeof Sticker; SectionHeading: typeof SectionHeading; FeatureCard: typeof FeatureCard;
      StepLoop: typeof StepLoop; AgeTimeline: typeof AgeTimeline; FeelingChip: typeof FeelingChip; LanguageChips: typeof LanguageChips;
      FAQ: typeof FAQ; OfferCard: typeof OfferCard; AnnouncementBar: typeof AnnouncementBar; StickyBuyBar: typeof StickyBuyBar;
      ComparisonTable: typeof ComparisonTable; TrustList: typeof TrustList; Testimonial: typeof Testimonial;
      ImaginationFrame: typeof ImaginationFrame; CastCard: typeof CastCard; SocialPost: typeof SocialPost; DeckSlide: typeof DeckSlide;
      AppSummaryCard: typeof AppSummaryCard; ParentControl: typeof ParentControl; ModeSwitch: typeof ModeSwitch; TextField: typeof TextField;
      NavBar: typeof NavBar; Footer: typeof Footer; Icon: typeof Icon; Hand: typeof Hand; Mark: typeof Mark;
      Logo: typeof Logo; IconButton: typeof IconButton; Menu: typeof Menu; TextArea: typeof TextArea; Select: typeof Select;
      Checkbox: typeof Checkbox; RadioGroup: typeof RadioGroup; Switch: typeof Switch; Badge: typeof Badge; Tag: typeof Tag;
      Alert: typeof Alert; Toast: typeof Toast; Tooltip: typeof Tooltip; EmptyState: typeof EmptyState; Spinner: typeof Spinner;
      ProgressBar: typeof ProgressBar; Dialog: typeof Dialog; BottomSheet: typeof BottomSheet; NavDrawer: typeof NavDrawer;
      Tabs: typeof Tabs; TabBar: typeof TabBar; List: typeof List; ListItem: typeof ListItem; Avatar: typeof Avatar;
      formatINR: typeof formatINR; FEELINGS: Record<Feeling, { icon: IconName; label: string; description: string }>;
      LANGUAGES: Language[]; ICON_NAMES: IconName[];
    };
  }
}
