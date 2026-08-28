import { SiPython, SiJavascript, SiC, SiReact, SiHtml5, SiNodedotjs, SiMysql, SiGit, SiGithub } from 'react-icons/si';
import { FaJava, FaCss3Alt } from 'react-icons/fa6';
import { TbBinaryTree, TbDatabase, TbCube3dSphere } from 'react-icons/tb';
import { VscVscode } from 'react-icons/vsc';

export const skillsData = [
  {
    name: "Java",
    category: "Languages",
    glowColor: "#ED8B00",
    level: "Advanced",
    icon: <FaJava className="w-8 h-8 text-[#ED8B00]" />,
  },
  {
    name: "Python",
    category: "Languages",
    glowColor: "#3776AB",
    level: "Advanced",
    icon: <SiPython className="w-8 h-8 text-[#3776AB]" />,
  },
  {
    name: "JavaScript",
    category: "Languages",
    glowColor: "#F7DF1E",
    level: "Advanced",
    icon: <SiJavascript className="w-8 h-8 text-[#F7DF1E] bg-slate-900 rounded-sm p-0.5" />,
  },
  {
    name: "C Language",
    category: "Languages",
    glowColor: "#00599C",
    level: "Intermediate",
    icon: <SiC className="w-8 h-8 text-[#00599C]" />,
  },
  {
    name: "React.js",
    category: "Frontend",
    glowColor: "#61DAFB",
    level: "Advanced",
    icon: <SiReact className="w-8 h-8 text-[#61DAFB]" />,
  },
  {
    name: "HTML5",
    category: "Frontend",
    glowColor: "#E34F26",
    level: "Advanced",
    icon: <SiHtml5 className="w-8 h-8 text-[#E34F26]" />,
  },
  {
    name: "CSS3",
    category: "Frontend",
    glowColor: "#1572B6",
    level: "Advanced",
    icon: <FaCss3Alt className="w-8 h-8 text-[#1572B6]" />,
  },
  {
    name: "Node.js",
    category: "Backend",
    glowColor: "#5FA04E",
    level: "Intermediate",
    icon: <SiNodedotjs className="w-8 h-8 text-[#5FA04E]" />,
  },
  {
    name: "SQL",
    category: "Database",
    glowColor: "#4479A1",
    level: "Advanced",
    icon: <SiMysql className="w-8 h-8 text-[#4479A1]" />,
  },
  {
    name: "DSA",
    category: "Core Concepts",
    glowColor: "#8B5CF6",
    level: "Advanced",
    icon: <TbBinaryTree className="w-8 h-8 text-[#8B5CF6]" />,
  },
  {
    name: "DBMS",
    category: "Core Concepts",
    glowColor: "#3B82F6",
    level: "Advanced",
    icon: <TbDatabase className="w-8 h-8 text-[#3B82F6]" />,
  },
  {
    name: "OOP Concepts",
    category: "Core Concepts",
    glowColor: "#10B981",
    level: "Advanced",
    icon: <TbCube3dSphere className="w-8 h-8 text-[#10B981]" />,
  },
  {
    name: "Git & GitHub",
    category: "Tools",
    glowColor: "#F05032",
    level: "Advanced",
    icon: (
      <div className="flex items-center gap-1">
        <SiGit className="w-6 h-6 text-[#F05032]" />
        <SiGithub className="w-6 h-6 text-slate-800" />
      </div>
    ),
  },
  {
    name: "VS Code",
    category: "Tools",
    glowColor: "#007ACC",
    level: "Advanced",
    icon: <VscVscode className="w-8 h-8 text-[#007ACC]" />,
  },
];
