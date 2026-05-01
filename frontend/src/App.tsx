import { useEffect } from 'react';
import { Layout } from './components/Layout/Layout';
import { Inbox } from './components/Inbox/Inbox';
import { Projects } from './components/Projects/Projects';
import { ProjectDetail } from './components/ProjectDetail/ProjectDetail';
import { Execution } from './components/Execution/Execution';
import { Possibility } from './components/Possibility/Possibility';
import { Recycle } from './components/Recycle/Recycle';
import { Archive } from './components/Archive/Archive';
import { useAppStore } from './stores/appStore';
import './styles/global.css';

function App() {
  const {
    currentPage,
    currentProject,
    loadInboxTasks,
    loadProjects,
    loadExecutionTasks,
    loadPossibilityTasks,
    loadRecycleTasks,
    loadArchiveRecords,
  } = useAppStore();

  useEffect(() => {
    // 初始化加载所有数据
    loadInboxTasks();
    loadProjects();
    loadExecutionTasks();
    loadPossibilityTasks();
    loadRecycleTasks();
    loadArchiveRecords();
  }, []);

  const renderPage = () => {
    if (currentProject) {
      return <ProjectDetail />;
    }
    switch (currentPage) {
      case 'inbox':
        return <Inbox />;
      case 'projects':
        return <Projects />;
      case 'execution':
        return <Execution />;
      case 'possibility':
        return <Possibility />;
      case 'recycle':
        return <Recycle />;
      case 'archive':
        return <Archive />;
      default:
        return <Inbox />;
    }
  };

  return <Layout>{renderPage()}</Layout>;
}

export default App;