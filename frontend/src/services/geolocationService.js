export class GeolocationService {
  static async getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!("geolocation" in navigator)) {
        reject(new Error("Geolocation is not supported by your browser or device."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: Math.round(position.coords.accuracy || 10),
            altitude: position.coords.altitude ? Math.round(position.coords.altitude) : null,
            speed: position.coords.speed ? Number((position.coords.speed * 3.6).toFixed(1)) : 0, // convert m/s to km/h
            heading: position.coords.heading !== null && !isNaN(position.coords.heading) ? Math.round(position.coords.heading) : null,
            timestamp: position.timestamp || Date.now(),
          });
        },
        (error) => {
          let msg = "Unable to retrieve your location.";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              msg = "Location permission was denied. Please allow location access in your browser settings.";
              break;
            case error.POSITION_UNAVAILABLE:
              msg = "Location information is currently unavailable from your device.";
              break;
            case error.TIMEOUT:
              msg = "Location request timed out. Please try again.";
              break;
          }
          reject(new Error(msg));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000,
        }
      );
    });
  }

  /**
   * Watch user's live position in real-time continuously
   */
  static watchLivePosition(onPosition, onError, options = {}) {
    if (!("geolocation" in navigator)) {
      if (onError) onError(new Error("Geolocation is not supported by your browser or device."));
      return null;
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
      ...options
    };

    return navigator.geolocation.watchPosition(
      (position) => {
        const payload = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy || 8),
          altitude: position.coords.altitude ? Math.round(position.coords.altitude) : null,
          speed: position.coords.speed ? Number((position.coords.speed * 3.6).toFixed(1)) : 0, // km/h
          heading: position.coords.heading !== null && !isNaN(position.coords.heading) ? Math.round(position.coords.heading) : null,
          timestamp: position.timestamp || Date.now(),
        };
        if (onPosition) onPosition(payload);
      },
      (error) => {
        let msg = "Error tracking live position.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = "Location permission denied. Please enable GPS permissions in your browser.";
            break;
          case error.POSITION_UNAVAILABLE:
            msg = "Live GPS signal is currently unavailable.";
            break;
          case error.TIMEOUT:
            msg = "GPS tracking timed out waiting for satellite fix.";
            break;
        }
        if (onError) onError(new Error(msg));
      },
      defaultOptions
    );
  }

  /**
   * Stop watching live position
   */
  static clearLiveTracking(watchId) {
    if (watchId !== null && watchId !== undefined && "geolocation" in navigator) {
      navigator.geolocation.clearWatch(watchId);
    }
  }

  // Calculate distance between two coordinates in km using Haversine formula
  static calculateDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(2));
  }

  // Calculate initial compass bearing between two coordinates in degrees (0-360)
  static calculateBearing(lat1, lon1, lat2, lon2) {
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const y = Math.sin(dLon) * Math.cos((lat2 * Math.PI) / 180);
    const x =
      Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
      Math.sin((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.cos(dLon);
    const brng = (Math.atan2(y, x) * 180) / Math.PI;
    return Math.round((brng + 360) % 360);
  }
}
