import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Circle,
  ClipboardCheck,
  Copy,
  CreditCard,
  File,
  FileText,
  HelpCircle,
  Image,
  Laptop,
  Loader2,
  LucideProps,
  Moon,
  MoreVertical,
  Pizza,
  Plus,
  Settings,
  SunMedium,
  Trash,
  Twitter,
  User,
  X,
  type XIcon as LucideIcon,
  PlayCircle,
  LayoutGrid,
  Radio,
  ListMusic,
  Mic,
  Library,
  Calendar,
  CalendarClock,
  CalendarX as CalendarXIcon,
  CalendarCheck,
  LayoutDashboard,
  Settings2,
  Wrench,
  MessageSquare,
  UserCog,
  Book,
  GraduationCap,
  ShieldCheck,
  CalendarX,
  Users,
  MoreHorizontal,
  Github,
  AlignLeftIcon,
  Megaphone,
  FilePlus,
  Send,
  Search,
  CreditCardIcon,
  Calculator,
  Router,
  BarChart,
  Flame,
  Pencil,
  Wallet,
  StickyNote,
  BookCopy
  
} from "lucide-react";

export type Icon = typeof LucideIcon;

export const Icons = {
  book2:BookCopy,
  note:StickyNote,
  money:Wallet,
  close: X,
  spinner: Loader2,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  trash: Trash,
  post: FileText,
  page: File,
  media: Image,
  settings: Settings,
  billing: CreditCard,
  ellipsis: MoreVertical,
  add: Plus,
  warning: AlertTriangle,
  user: User,
  arrowRight: ArrowRight,
  help: HelpCircle,
  pizza: Pizza,
  twitter: Twitter,
  check: Check,
  copy: Copy,
  copyDone: ClipboardCheck,
  sun: SunMedium,
  moon: Moon,
  playCircle: PlayCircle,
  layoutGrid: LayoutGrid,
  listMusic: ListMusic,
  mic: Mic,
  fileText: FileText,
  library: Library,
  event: Calendar,
  calendarClock: CalendarClock,
  calendarCheck: CalendarCheck,
  layoutDashboard: LayoutDashboard,
  settings2: Settings2,
  wrench: Wrench,
  messageSquare: MessageSquare,
  userCog: UserCog,
  book: Book,
  calendarX: CalendarX,
  users: Users,
  moreHorizontal: MoreHorizontal,
  alignLeft: AlignLeftIcon,
  fileplus: FilePlus,
  send: Send,
  search: Search,
  creditCard: CreditCardIcon,
  calculator: Calculator,
  router: Router,
  barchart: BarChart,
  edit:Pencil,
  home: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mr-2 h-4 w-4"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  ),

  google: (props: LucideProps) => (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        fill="currentcolor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
      />{" "}
    </svg>
  ),
  logo: (props: LucideProps) => (
    <svg viewBox="0 0 24 24" {...props}>
      <g transform="matrix(1,0,0,1,-484.285,-545.852)">
        <g transform="matrix(0.364565,0,0,0.364565,317.853,304.675)">
          <g transform="matrix(1,0,0,1,0,45.5611)">
            <path d="M496.717,651.67C495.616,653.139 494.338,654.469 492.915,655.626L492.915,646.5C492.915,638.595 486.498,632.177 478.593,632.177C470.688,632.177 464.271,638.595 464.271,646.5L464.271,655.208C463.039,654.145 461.926,652.95 460.951,651.646L460.951,645.45C460.951,635.58 468.964,627.567 478.834,627.567C488.704,627.567 496.717,635.58 496.717,645.45L496.717,651.67ZM489.915,657.687C488.614,658.432 487.231,659.051 485.782,659.525L485.782,647.019C485.782,643.039 482.551,639.808 478.57,639.808C474.59,639.808 471.358,643.039 471.358,647.019L471.358,659.338C469.922,658.827 468.554,658.172 467.271,657.392L467.271,646.5C467.271,640.251 472.344,635.177 478.593,635.177C484.842,635.177 489.915,640.251 489.915,646.5L489.915,657.687ZM457.951,646.173C457.028,643.726 456.523,641.074 456.523,638.306C456.523,625.987 466.524,615.986 478.843,615.986C491.162,615.986 501.163,625.987 501.163,638.306C501.163,641.092 500.652,643.76 499.717,646.22L499.717,645.45C499.717,633.925 490.36,624.567 478.834,624.567C467.308,624.567 457.951,633.925 457.951,645.45L457.951,646.173Z" />
          </g>
          <g transform="matrix(1,0,0,1,40.0984,-7.27673)">
            <path d="M484.959,688.756C484.172,688.65 483.479,688.596 482.878,688.596C480.691,688.596 479.257,689.337 478.577,690.817L478.577,704.982L472.795,704.982L472.795,683.335L478.257,683.335L478.417,685.915C479.577,683.928 481.185,682.935 483.239,682.935C483.879,682.935 484.479,683.021 485.039,683.195L484.959,688.756Z" />
            <path d="M497.703,705.382C494.529,705.382 491.945,704.408 489.951,702.461C487.957,700.514 486.96,697.919 486.96,694.678L486.96,694.118C486.96,691.944 487.38,690 488.22,688.286C489.06,686.572 490.251,685.252 491.791,684.325C493.332,683.398 495.089,682.935 497.063,682.935C500.024,682.935 502.355,683.868 504.055,685.735C505.756,687.603 506.606,690.25 506.606,693.678L506.606,696.039L492.822,696.039C493.008,697.453 493.572,698.586 494.512,699.44C495.452,700.293 496.643,700.72 498.083,700.72C500.311,700.72 502.051,699.913 503.305,698.299L506.146,701.481C505.279,702.708 504.105,703.665 502.625,704.351C501.144,705.038 499.504,705.382 497.703,705.382ZM497.043,687.616C495.896,687.616 494.966,688.003 494.252,688.776C493.539,689.55 493.082,690.657 492.882,692.097L500.924,692.097L500.924,691.637C500.898,690.357 500.551,689.367 499.884,688.666C499.217,687.966 498.27,687.616 497.043,687.616Z" />
            <rect x="510.187" y="674.252" width="5.802" height="30.73" />
            <path d="M530.714,705.382C527.54,705.382 524.955,704.408 522.961,702.461C520.967,700.514 519.97,697.919 519.97,694.678L519.97,694.118C519.97,691.944 520.391,690 521.231,688.286C522.071,686.572 523.262,685.252 524.802,684.325C526.343,683.398 528.1,682.935 530.074,682.935C533.035,682.935 535.365,683.868 537.066,685.735C538.767,687.603 539.617,690.25 539.617,693.678L539.617,696.039L525.832,696.039C526.019,697.453 526.583,698.586 527.523,699.44C528.463,700.293 529.654,700.72 531.094,700.72C533.321,700.72 535.062,699.913 536.316,698.299L539.157,701.481C538.29,702.708 537.116,703.665 535.636,704.351C534.155,705.038 532.515,705.382 530.714,705.382ZM530.054,687.616C528.907,687.616 527.976,688.003 527.263,688.776C526.549,689.55 526.092,690.657 525.892,692.097L533.935,692.097L533.935,691.637C533.908,690.357 533.562,689.367 532.895,688.666C532.228,687.966 531.281,687.616 530.054,687.616Z" />
            <path d="M549.82,678.013L549.82,683.335L553.521,683.335L553.521,687.576L549.82,687.576L549.82,698.38C549.82,699.18 549.974,699.753 550.28,700.1C550.587,700.447 551.174,700.62 552.041,700.62C552.681,700.62 553.248,700.574 553.741,700.48L553.741,704.862C552.608,705.208 551.441,705.382 550.24,705.382C546.186,705.382 544.118,703.334 544.038,699.24L544.038,687.576L540.877,687.576L540.877,683.335L544.038,683.335L544.038,678.013L549.82,678.013Z" />
          </g>
        </g>
      </g>
    </svg>
  ),
  dollar: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="h-4 w-4 text-primary "
    >
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
};

export function CustomIcon({ icon }: { icon: string }) {
  // @ts-ignore
  const Icon = Icons[icon];
  if (!Icon) {
    return null;
  }
  return <Icon />;
}

export const HamburgerIcon = () => (
  <svg width="18" height="11" viewBox="0 0 18 11" fill="none">
    <path d="M0 0H18V1H0V0Z" fill="white"></path>
    <path d="M0 10H18V11H0V10Z" fill="white"></path>
  </svg>
);
