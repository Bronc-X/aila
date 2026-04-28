import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, GraduationCap, UsersRound } from "lucide-react";
import styles from "../site.module.css";

const workshopDays = [
  {
    day: "Day 1 · 4 月 17 日",
    title: "认知破局：看清 AI 能力边界和企业差距",
    sessions: [
      {
        time: "上午",
        title: "大语言模型发展现状与通识讲解",
        goal: "激活企业主对 AI 的真实判断：不是追热点，而是看懂业务差距正在从哪里被拉开。",
        points: [
          "2026 年 AI 发展到了什么阶段，哪些能力已经能进入日常业务",
          "会用 AI 和不会用 AI 的企业差距，正在体现在哪些成本、效率和转化环节",
          "老板已经有意识拥抱 AI，但员工没跟上的组织断层怎么处理",
        ],
      },
      {
        time: "下午",
        title: "行业案例 + 现场实战",
        goal: "用真实、快速、高效的演示，让企业主看到 AI 可以从一个具体痛点切进企业。",
        points: [
          "电商、外贸出海、制造业、快消服务、农业的典型案例梳理",
          "现场选择一位企业主，沟通业务痛点并拆出真实需求",
          "当场设计一个 AI 工具原型，用来解决一个具体业务问题",
        ],
      },
    ],
  },
  {
    day: "Day 2 · 4 月 18 日",
    title: "工具落地：把 AI 接到员工和业务流程里",
    sessions: [
      {
        time: "上午",
        title: "AI 工具实操与企业落地",
        goal: "让企业主真正感受到，AI 可以在实际业务里提效、拉流量、增转化。",
        points: [
          "获客端：批量生图、视频生成、文案生成",
          "销售端：对话摘要、实时话术提示、快速回访、灵感追问",
          "运营端：日报周报、销售看板、回访进度和成交数据分析",
        ],
      },
      {
        time: "下午",
        title: "自由交流与企业 AI 作战地图",
        goal: "把两天内容收束到每家企业自己的前期、营销、销售、研发、运营和售后链路。",
        points: [
          "围绕企业主现场问题自由交流，补齐行业差异和团队阻力",
          "拆出企业内部适合先动的业务环节和负责人",
          "形成可带走的 AI 改造路线图和下一步行动清单",
        ],
      },
    ],
  },
];

const speakers = [
  {
    name: "谢大叔",
    role: "连续创业者 · SCUT 硕士 · 企业运营总监",
    text: "深耕企业数字化转型与组织效能提升，负责把 AI 改造放回真实经营场景。",
    image: "/speaker-xie.jpg",
  },
  {
    name: "Toni",
    role: "AI Builder · 独立开发者 · ToB 落地 20+",
    text: "从 MVP 到生产级的全栈 AI 应用交付，负责把课程方法接到可演示工具。",
    image: "/speaker-toni.jpg",
  },
];

const resources = [
  ["Slides", "讲义入口，承接课程方法、案例拆解和现场演示材料。", "/slides"],
  ["AILA", "把获客、销售、研发、运营、行政、客服拆成可进入的工具矩阵。", "/aila"],
  ["Services", "需要从培训走到企业内部系统时，进入诊断、原型和交付流程。", "/services"],
];

export default function TrainingPage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}>
          <span>T</span>
          Toni
        </Link>
        <div className={styles.links}>
          <Link href="/work">作品</Link>
          <Link href="/services">企业合作</Link>
          <Link href="/about">关于</Link>
          <Link href="/aila">AILA</Link>
          <Link href="/training">课程</Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>
            <GraduationCap size={16} />
            Past workshop system
          </p>
          <h1>把 2026 闭门课沉淀成可复用的 AI 训练系统。</h1>
          <p className={styles.lede}>
            4 月 17-18 日闭门课按四个半天推进：先看懂大语言模型和企业差距，再拆行业案例与现场实战，最后把工具实操收束成企业自己的 AI 改造路线图。
          </p>
        </div>
        <aside className={styles.portraitPanel}>
          <div className={styles.mediaFrame}>
            <Image
              src="/cases/poster_dark_luxury_1775063907112.png"
              alt="AI training workshop visual"
              fill
              sizes="(max-width: 900px) 100vw, 34vw"
            />
          </div>
          <div className={styles.statStrip}>
            <div>
              <strong>2d</strong>
              <span>闭门训练</span>
            </div>
            <div>
              <strong>4</strong>
              <span>核心场次</span>
            </div>
            <div>
              <strong>12</strong>
              <span>工具筛选</span>
            </div>
          </div>
        </aside>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>课程不是热闹场，是把判断、工具和落地动作排成顺序。</h2>
          <p>
            每个半天都对应一个明确目标：认知、案例、工具、路线图。讲完之后，企业主应该知道自己先改哪条业务链，而不是只带走一堆工具名。
          </p>
        </div>
        <div className={styles.timelineGrid}>
          {workshopDays.map((day) => (
            <article className={styles.timelineItem} key={day.day}>
              <small>{day.day}</small>
              <h3>{day.title}</h3>
              <div className={styles.schedule}>
                {day.sessions.map((session) => (
                  <div className={styles.scheduleRow} key={session.title}>
                    <strong>{session.time}</strong>
                    <div>
                      <h3>{session.title}</h3>
                      <p>{session.goal}</p>
                      <ul className={styles.pointList}>
                        {session.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>讲师信息保留真实身份与现场分工。</h2>
          <p>谢大叔负责把 AI 改造放回经营现场；Toni 负责把课程方法接到可演示、可试用的工具原型。</p>
        </div>
        <div className={styles.twoGrid}>
          {speakers.map((speaker) => (
            <article className={styles.caseCard} key={speaker.name}>
              <div className={styles.mediaFrame}>
                <Image src={speaker.image} alt={`${speaker.name} portrait`} fill sizes="(max-width: 900px) 100vw, 44vw" />
              </div>
              <div>
                <small>
                  <UsersRound size={13} />
                  Speaker
                </small>
                <h3>{speaker.name}</h3>
                <p>
                  <strong>{speaker.role}</strong>
                  <br />
                  {speaker.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.grid}>
          {resources.map(([title, text, href]) => (
            <article className={styles.resourceCard} key={title}>
              <small>
                <CalendarDays size={13} />
                Resource
              </small>
              <h3>{title}</h3>
              <p>{text}</p>
              <Link href={href} className={styles.resourceLink}>
                打开入口 <ArrowUpRight size={14} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <h2>培训的下一步，是把课程里的流程直接做成企业内部工具。</h2>
        <div className={styles.actions}>
          <Link href="/services" className={styles.button}>
            看企业合作
          </Link>
          <Link href="/aila" className={styles.ghost}>
            看 AILA <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}
