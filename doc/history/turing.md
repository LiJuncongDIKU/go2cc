# 历史巨人
从理论到实践，诚然有无数的历史先辈在计算机领域做出了重要贡献。而这两位算是不得不提~

> 笔者作为软件工程毕业的前端也在理论课上学了一部分，感觉应该放到这个项目里简单带一带

## 艾伦·图灵（Alan Turing）
艾伦·图灵（Alan Turing，1912-1954）是英国数学家、逻辑学家，被公认为**“计算机科学之父”和“人工智能之父”**。

### 图灵机 (Turing Machine)
图灵机是图灵1937年发表的论文 [《论可计算数及其在判定问题上的应用》（On Computable Numbers, with an Application to the Entscheidungsproblem）](https://turingarchive.kings.cam.ac.uk/publications-lectures-and-talks-amtb/amt-b-12) 中提出的一种理论模型，用于描述计算机的工作原理。

<strong style="font-size: 16px; color: #aa0000;">只要通过简单的指令（读、写、移动纸带），一台机器就能模拟人类进行的任何数学运算。</strong>

### 二战中图灵机的著名实践：Bombe
![Bombe](https://3-im.guokr.com/gkimage/u3/h8/9v/u3h89v.png) <i>（图片来源于网络）</i>

Bombe是二战的时候图灵设计的一种密码破译机，用于破译纳粹德军的密码。电影《模仿游戏》（The Imitation Game）就讲述了二战期间，图灵机在密码破译中的重要作用，相信程序员都看过这部电影。

## 冯·诺依曼（John von Neumann）
冯·诺依曼（John von Neumann，1903-1957）是匈牙利裔美国数学家、物理学家、工程师，被公认为**“计算机科学之父”**。

在冯·诺依曼 1945 年发表[《关于 EDVAC 报告的第一份草案》（First Draft of a Report on the EDVAC）](https://archive.computerhistory.org/resources/text/Knuth_Don_X4100/PDF_index/k-8-pdf/k-8-u2593-Draft-EDVAC.pdf)前，类似上面说的 Bombe, 当时的人们目标是做出一个足够复杂的计算器比如尚未完工的 ENIAC（当时建造中的世界上第一台通用电子计算机）；而指令系统算是空白，比如当时的人们需要插拔电线、更换指令卡等。

### 存储程序控制（Stored-program Control）原理
冯·诺依曼 1945 年发表的 EDVAC 报告中，提出了存储程序控制（Stored-program Control）原理。简单来说，就是将指令和数据存储在内存中，通过指令指针（Instruction Pointer）来控制程序的执行。

#### “取指-执行循环” (Fetch-Execute Cycle)
冯·诺依曼机的运行过程被称为 “取指-执行循环” (Fetch-Execute Cycle)。计算机会像一个永不停歇的传送带一样循环以下四个步骤：
:::warning 取指-执行循环
1. 取指令 (Fetch)： 控制器根据“程序计数器（PC）”里的地址，去存储器里把下一条指令拿出来。
2. 译码 (Decode)： 控制器分析这串 0 和 1 到底代表什么意思（是加法？还是跳转？）。
3. 执行 (Execute)： 控制器指挥运算器进行计算，或者指挥内存移动数据。
4. 回写 (Store)： 将计算结果存回内存。
:::

为了实现“存储程序”，他定义了计算机的五大基本组成部分，这种结构沿用至今：

:::tip 五大基本组成部分
- 存储器 (Memory)： 存放指令和数据的地方。
- 运算器 (ALU)： 负责加减乘除等算术逻辑运算。
- 控制器 (CU)： 负责指挥。它从内存拿指令、翻译指令、发令给其他部件。
- 输入设备 (Input)： 将信息送入机器。
- 输出设备 (Output)： 将结果展示给用户。
:::

