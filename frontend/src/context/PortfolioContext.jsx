import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getPortfolio } from '../api/portfolio.api';
import { getProjects } from '../api/projects.api';
import { getSkills } from '../api/skills.api';
import { getTimeline } from '../api/timeline.api';

export const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [portfolioData, setPortfolioData] = useState({
    portfolio: null,
    projects: [],
    skills: [],
    timeline: [],
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    try {
      setPortfolioData(prev => ({ ...prev, loading: true, error: null }));
      const [portfolio, projects, skills, timeline] = await Promise.all([
        getPortfolio(),
        getProjects(),
        getSkills(),
        getTimeline()
      ]);
      setPortfolioData({ portfolio, projects, skills, timeline, loading: false, error: null });
    } catch (error) {
      console.error('Failed to fetch portfolio data:', error);
      setPortfolioData(prev => ({ ...prev, loading: false, error: 'Failed to load data.' }));
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => {
    fetchData();
  };

  return (
    <PortfolioContext.Provider value={{ ...portfolioData, refetch }}>
      {children}
    </PortfolioContext.Provider>
  );
};
