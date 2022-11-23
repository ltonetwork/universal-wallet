const txTypes: {[_: number]: {name: string, description: string, icon: {in?: string, out?: string}}} = {
    1: { name: 'genesis', description: 'Genesis', icon: { in: 'download-outline' } },
    4: { name: 'transfer', description: 'Transfer', icon: { in: 'download-outline', out: 'upload-outline' } },
    8: { name: 'start_lease', description: 'Lease', icon: { in: 'download-outline', out: 'upload-outline' } },
    9: { name: 'cancel_lease', description: 'Cancel Lease', icon: { in: 'download-off-outline', out: 'upload-off-outline' } },
    11: { name: 'mass_transfer', description: 'Mass Transfer', icon: { in: 'download-outline', out: 'upload-outline' } },
    13: { name: 'script', description: 'Script', icon: { out: 'circle-small' } },
    15: { name: 'anchor', description: 'Anchor', icon: { out: 'circle-small' } },
    16: { name: 'invoke_association', description: 'Issue Association', icon: { in: 'link-variant', out: 'link-variant' } },
    17: { name: 'revoke_association', description: 'Revoke Association', icon: { in: 'link-variant-off', out: 'link-variant-off' } },
    18: { name: 'sponsor', description: 'Sponsorship', icon: { in: 'download-outline', out: 'upload-outline' } },
    19: { name: 'cancel_sponsor', description: 'Cancel Sponsorship', icon: { in: 'download-off-outline', out: 'upload-off-outline' } },
    20: { name: 'register', description: 'Register', icon: { out: 'circle-small' } },
    21: { name: 'burn', description: 'Burn', icon: { out: 'upload-outline' } },
    22: { name: 'mapped_anchor', description: 'Mapped Anchor', icon: { out: 'circle-small' } },
    23: { name: 'statement', description: 'Statement', icon: { out: 'circle-small' } },
}

export default txTypes;
