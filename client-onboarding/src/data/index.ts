import type { ServiceFlow, ServiceType } from '../types';
import { websiteFlow } from './websiteFlow';
import { brandingFlow } from './brandingFlow';
import { automationFlow } from './automationFlow';

/**
 * All available service flows
 */
export const serviceFlows: Record<ServiceType, ServiceFlow> = {
    website: websiteFlow,
    branding: brandingFlow,
    automation: automationFlow,
};

/**
 * Get a service flow by type
 */
export const getServiceFlow = (serviceType: ServiceType): ServiceFlow => {
    return serviceFlows[serviceType];
};

/**
 * Get all available services
 */
export const getAllServices = (): Array<{ type: ServiceType; name: string }> => {
    return Object.values(serviceFlows).map((flow) => ({
        type: flow.serviceType,
        name: flow.serviceName,
    }));
};
