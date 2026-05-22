import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { getPortfolio } from '../api/portfolio.api';
import { getProjects } from '../api/projects.api';
import { getSkills } from '../api/skills.api';
import { getTimeline } from '../api/timeline.api';
import { AuthContext } from './AuthContext';

export const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const { isAuthenticated, isLoading: isAuthLoading } = useContext(AuthContext);
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
        getProjects(isAuthenticated),
        getSkills(isAuthenticated),
        getTimeline()
      ]);
      setPortfolioData({ portfolio, projects, skills, timeline, loading: false, error: null });
    } catch (error) {
      console.error('Failed to fetch portfolio data:', error);
      setPortfolioData(prev => ({ ...prev, loading: false, error: 'Failed to load data.' }));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthLoading) {
      fetchData();
    }
  }, [fetchData, isAuthLoading, isAuthenticated]);

  const refetch = () => {
    fetchData();
  };

  return (
    <PortfolioContext.Provider value={{ ...portfolioData, refetch }}>
      {children}
    </PortfolioContext.Provider>
  );
};
