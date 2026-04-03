import React from "react";
import { CheckCircle2, AlertTriangle, Zap, PackageOpen, Target, Server, Factory, Film } from "lucide-react";

export const caseDetails: Record<string, React.ReactNode> = {
  manufacturing: (
    <div className="space-y-10">
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <h2 className="text-3xl font-black text-[#2D2A26] mb-2 tracking-normal flex items-center gap-3"><Factory className="text-[var(--brand-glow)]" size={32} /> 工业制造：老师傅请假，产线不再停</h2>
      </div>
      <div className="space-y-6 text-lg text-[var(--text-secondary)] leading-relaxed">
        <p className="font-bold text-[#2D2A26] text-xl">你的工厂是不是也有这些痛？</p>
        <ul className="space-y-4 border-t border-[#E5E1D8] pt-4">
          <li className="flex gap-4"><Target className="text-[var(--brand-primary)] shrink-0 mt-1" size={20} /> <div><b className="text-[#2D2A26]">注塑/五金厂：</b>模具良品率全靠师傅肉眼挑，老师傅一请假就出大批次质量事故。AI视觉检测系统上线后，50人质检组缩编到5人，准确率反升到99.8%。</div></li>
          <li className="flex gap-4"><Target className="text-[var(--brand-primary)] shrink-0 mt-1" size={20} /> <div><b className="text-[#2D2A26]">包装印刷厂：</b>色差比对靠人手举色卡，赶货时老板自己上手都来不及。AI色差/套位检测上线，色差投诉率从月均12起→0起。</div></li>
          <li className="flex gap-4"><Target className="text-[var(--brand-primary)] shrink-0 mt-1" size={20} /> <div><b className="text-[#2D2A26]">机加工厂：</b>CNC加工完人工量检，每件量3分钟，检测环节成了产能最大瓶颈。AI在线测量系统让检测速度提升20倍，日产能直接翻番。</div></li>
        </ul>
        <p className="bg-[#FFF8F0] border border-[#D97706] p-4 rounded-lg font-bold text-[#D97706]">
          ★ 核心逻辑：AI不是替代工人，是替代"最容易疲劳犯错"的那个环节。你的产线上，哪个检测环节最依赖人眼？那就是第一个要改造的点。
        </p>
      </div>
    </div>
  ),

  retail: (
    <div className="space-y-10">
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <h2 className="text-3xl font-black text-[#2D2A26] mb-2 tracking-normal flex items-center gap-3"><PackageOpen className="text-[var(--brand-glow)]" size={32} /> 跨境出海：询盘不过夜，选品不靠飞</h2>
      </div>
      <div className="space-y-6 text-lg text-[var(--text-secondary)] leading-relaxed">
        <p className="font-bold text-[#2D2A26] text-xl">出海老板的三大烧钱黑洞</p>
        <ul className="space-y-4 pt-4 border-t border-[#E5E1D8]">
          <li className="flex gap-4"><Target className="text-[var(--brand-primary)] shrink-0 mt-1" size={20} /> <div><b className="text-[#2D2A26]">翻译+文案：</b>开一个新品要翻6国语言、拍8组场景图、写8套文案、分平台上架。以前需要3个外籍文案+2周时间，成本5万+。现在AI Agent全串联，半天搞定，质量不输母语写手。</div></li>
          <li className="flex gap-4"><Target className="text-[var(--brand-primary)] shrink-0 mt-1" size={20} /> <div><b className="text-[#2D2A26]">询盘流失：</b>阿里国际站的询盘，2小时不回客户就流失给竞争对手。AI客服7×24秒级回复，自动生成报价单，转化率提升35%。</div></li>
          <li className="flex gap-4"><Target className="text-[var(--brand-primary)] shrink-0 mt-1" size={20} /> <div><b className="text-[#2D2A26]">选品靠飞：</b>老板飞美国选品一趟花20万，回来还拿不准。AI全网数据抓取+趋势评分+竞品分析，10分钟出选品报告，准确率比人肉考察还高。</div></li>
        </ul>
        <p className="bg-[#FFF8F0] border border-[#D97706] p-4 rounded-lg font-bold text-[#D97706]">
          ★ 某深圳3C出海团队：外籍文案3人→0人，年省45万；新品开城周期14天→半天。老板说："早用半年，少亏100万。"
        </p>
      </div>
    </div>
  ),

  service: (
    <div className="space-y-10">
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <h2 className="text-3xl font-black text-[#2D2A26] mb-2 tracking-normal flex items-center gap-3"><Server className="text-[var(--brand-glow)]" size={32} /> 泛服务业：经验不再被人带走</h2>
      </div>
      <div className="space-y-6 text-lg text-[var(--text-secondary)] leading-relaxed">
        <p className="font-bold text-[#2D2A26] text-xl">每个服务业老板都有这个噩梦：核心员工离职</p>
        <ul className="space-y-4 pt-4 border-t border-[#E5E1D8]">
          <li className="flex gap-4"><Target className="text-[var(--brand-primary)] shrink-0 mt-1" size={20} /> <div><b className="text-[#2D2A26]">律所/法务：</b>老合伙人带走客户和经验，新律师面对复杂案件不敢接。用AI+十年卷宗构建知识库后，实习律师也能出专家级法律意见书，客户留存率提升60%。</div></li>
          <li className="flex gap-4"><Target className="text-[var(--brand-primary)] shrink-0 mt-1" size={20} /> <div><b className="text-[#2D2A26]">财税/审计：</b>每年政策变动50+条，靠人记根本不靠谱，一个错判赔掉全年利润。政策知识库+智能申报审查上线后，差错率从5%→0.3%。</div></li>
          <li className="flex gap-4"><Target className="text-[var(--brand-primary)] shrink-0 mt-1" size={20} /> <div><b className="text-[#2D2A26]">医美/连锁门店：</b>好销售一走客户全丢，新人培训3个月才能独立接客。销售话术库+客户画像AI推荐上线，新人上手周期从3月→1周。</div></li>
          <li className="flex gap-4"><Target className="text-[var(--brand-primary)] shrink-0 mt-1" size={20} /> <div><b className="text-[#2D2A26]">装修/建材：</b>设计师经验全在脑子里，换个人报价差距30%。项目知识库+AI自动估价系统，报价一致性提升到98%。</div></li>
        </ul>
        <p className="bg-[#FFF8F0] border border-[#D97706] p-4 rounded-lg font-bold text-[#D97706]">
          ★ 核心问题：你公司最值钱的知识，是存在系统里，还是存在某个人的脑子里？如果是后者，那个人走了，你的护城河就没了。
        </p>
      </div>
    </div>
  ),

  media: (
    <div className="space-y-10">
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <h2 className="text-3xl font-black text-[#2D2A26] mb-2 tracking-normal flex items-center gap-3"><Film className="text-[var(--brand-glow)]" size={32} /> 内容传媒：你播一场，AI裂变一千场</h2>
      </div>
      <div className="space-y-6 text-lg text-[var(--text-secondary)] leading-relaxed">
        <p className="font-bold text-[#2D2A26] text-xl">做内容的老板都算过这笔账</p>
        <ul className="space-y-4 pt-4 border-t border-[#E5E1D8]">
          <li className="flex gap-4"><Target className="text-[var(--brand-primary)] shrink-0 mt-1" size={20} /> <div><b className="text-[#2D2A26]">短视频矩阵：</b>以前养10个号，要雇5个剪辑+3个文案，月人力成本4万+。现在AI一天批量产出200条不重复内容，自动匹配平台算法分发。</div></li>
          <li className="flex gap-4"><Target className="text-[var(--brand-primary)] shrink-0 mt-1" size={20} /> <div><b className="text-[#2D2A26]">直播切片：</b>老板自己播一场，AI自动识别高光时刻，切成50条精华带货视频，自动加字幕、配背景音乐，分发全平台。</div></li>
          <li className="flex gap-4"><Target className="text-[var(--brand-primary)] shrink-0 mt-1" size={20} /> <div><b className="text-[#2D2A26]">公众号/小红书：</b>企业新媒体运营发一条推文要改8遍，现在AI 3分钟从热点采集、观点改写、配图、排版全部搞定。</div></li>
          <li className="flex gap-4"><Target className="text-[var(--brand-primary)] shrink-0 mt-1" size={20} /> <div><b className="text-[#2D2A26]">数字人IP：</b>老板录一段口播模板，AI生成多语言版本，直接在TikTok全球账号分发，一个人做全球市场。</div></li>
        </ul>
        <p className="bg-[#FFF8F0] border border-[#D97706] p-4 rounded-lg font-bold text-[#D97706]">
          ★ 某餐饮品牌：外包摄影费从年15万→0，抖音矩阵曝光放大100倍。老板原话："以前一条视频拍2天，现在AI一天出200条。"
        </p>
      </div>
    </div>
  ),

  "live-coding": (
    <div className="space-y-10">
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <h2 className="text-4xl font-black text-gradient mb-2 tracking-normal">45 MIN Live Coding 复盘</h2>
        <p className="text-[var(--text-secondary)]">刚刚在控制台中创造的心智奇迹</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[#2D2A26] flex items-center gap-2">
            <Zap className="text-[var(--brand-glow)]" /> 工作流骨架
          </h3>
          <ul className="space-y-4 text-[var(--text-secondary)]">
            <li className="flex gap-3"><CheckCircle2 className="text-green-400 mt-1 shrink-0" size={20} /> <p><b>节点 1 接收器：</b> 自动轮询监听特定竞对公众号或网页的发文。</p></li>
            <li className="flex gap-3"><CheckCircle2 className="text-green-400 mt-1 shrink-0" size={20} /> <p><b>节点 2 深思考：</b> GPT-4o 瞬间解析竞对卖点，提取核心攻击方向。</p></li>
            <li className="flex gap-3"><CheckCircle2 className="text-green-400 mt-1 shrink-0" size={20} /> <p><b>节点 3 终结者：</b> 生成防守反击文案并发放至审核飞书群中。</p></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[#2D2A26] flex items-center gap-2">
            <AlertTriangle className="text-red-400" /> 对老板的启示
          </h3>
          <p className="text-[var(--text-secondary)] leading-loose">
            <span className="text-[#2D2A26] bg-[rgba(255,100,100,0.1)] py-1">构建这套防御反击系统，我们没写一行传统业务代码。</span> 
            全凭借简单的模块拼装与系统性思维（System Prompt）。您公司到底还有多少像过去这样依赖人工盯梢、汇总、分发的腐朽环节？
          </p>
        </div>
      </div>
    </div>
  ),
};
