import React, { useEffect, useRef } from 'react';
import angular from 'angular';
import '../legacy/angular-app'; 

export default function ActivityLog() {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!angular.element(el).injector()) {
      angular.bootstrap(el, ['legacyApp']);
    }
  }, []);

  const template = `
    <div ng-controller="ActivityLogCtrl">
      
      <div ng-if="loading">Loading tasks...</div>
      <div ng-if="error" style="color:red">{{ error }}</div>
      <table ng-if="!loading && !error" border="1" cellpadding="5" cellspacing="0">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          <tr ng-repeat="task in activities track by task.id">
            <td>{{ task.title }}</td>
            <td>{{ task.description }}</td>
            <td>{{ task.status }}</td>
            <td>{{ task.createdAt | date:'medium' }}</td>
            <td>{{ task.updatedAt | date:'medium' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: template }} />;
}
