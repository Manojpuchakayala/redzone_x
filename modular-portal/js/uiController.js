/**
 * Simple Dashboard UI Controller
 */
export class UIController {
  static updateKPIs(summary, rain) {
    document.getElementById('kpi-red-zones').innerText = `${summary.redZonesCount} Zones`;
    document.getElementById('kpi-evacuees').innerText = summary.totalDisplacedPopulation.toLocaleString();
    document.getElementById('kpi-safe-slots').innerText = summary.totalShelterCapacity.toLocaleString();
    document.getElementById('rain-display').innerText = `${rain} mm / 24h`;
  }

  static renderSidebar(tab, simulationResult, activeRouteHabId, onToggleRoute) {
    const container = document.getElementById('tab-content-area');
    container.innerHTML = '';

    simulationResult.relocationPriorities.forEach((hab) => {
      const isSelected = activeRouteHabId === hab.id;
      const card = document.createElement('div');
      card.className = `village-card ${isSelected ? 'active' : ''}`;

      const tagClass = hab.urgencyTier === 'IMMEDIATE' ? 'tag-red' : hab.urgencyTier === 'SHORT_TERM' ? 'tag-amber' : 'tag-blue';
      const destName = hab.allocationPlan?.splits?.[0]?.siteName || 'Designated Green Sanctuary';

      card.innerHTML = `
        <div class="village-top">
          <div class="village-name">#${hab.priorityRank} ${hab.name}</div>
          <span class="urgency-tag ${tagClass}">${hab.urgencyTier.replace('_', ' ')}</span>
        </div>

        <div class="village-details">
          <span>👥 Pop: <strong>${hab.population}</strong></span>
          <span>👴 Elderly: <strong>${hab.fingerprint.elderly}</strong></span>
          <span>♿ PwD: <strong>${hab.fingerprint.disabilities}</strong></span>
        </div>

        <div class="village-dest">
          ➡️ Relocate to: <strong>${destName}</strong>
        </div>

        ${hab.allocationPlan?.assignedRoute ? `
          <button class="btn-route ${isSelected ? 'active' : ''}" data-hab-id="${hab.id}">
            <i class="fa-solid fa-location-arrow"></i>
            <span>${isSelected ? '✓ Showing Route on Map' : 'Show Evacuation Path'}</span>
          </button>
        ` : ''}
      `;

      const btn = card.querySelector('.btn-route');
      if (btn) {
        btn.addEventListener('click', () => onToggleRoute(hab.id));
      }

      container.appendChild(card);
    });
  }

  static updateRouteBanner(habId, simulationResult) {
    // Banner simplified in minimal mode
  }
}
