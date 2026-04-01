'use client';
import styles from '@/components/form-elements/social-link-input/social-link-input.module.css';
import { useState } from 'react';
import { Input } from '@/components/form-elements/input';
import { Button } from '@/components/form-elements/button';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { Select } from '@/components/form-elements/select';
import type { GenericOption } from '@/components/form-elements/select/types';

import { SocialLink, socialPlatforms } from '@/lib/schemas/shared/social';

// helper
function toSingle<T>(v: T | readonly T[] | null): T | null {
  if (Array.isArray(v)) return (v[0] ?? null) as T | null;
  return v as T | null;
}

interface SocialLinksInputProps {
  defaultLinks?: SocialLink[];
  errors?: Record<string, string[]>;
}

type Option = { value: string; label: string };

export const SocialLinksInput = ({ defaultLinks = [], errors }: SocialLinksInputProps) => {
  const [links, setLinks] = useState<SocialLink[]>(
    defaultLinks.length > 0 ? defaultLinks : [{ platform: 'linkedin', url: '' }],
  );

  const updateLink = (index: number, field: keyof SocialLink, value: string) => {
    const updated = [...links];
    updated[index] = {
      ...updated[index],
      [field]: field === 'platform' ? (value as (typeof socialPlatforms)[number]) : value,
    };
    setLinks(updated);
  };

  const addLink = () => setLinks([...links, { platform: 'linkedin', url: '' }]);
  const removeLink = (index: number) => {
    if (links.length <= 1) return;
    const updated = [...links];
    updated.splice(index, 1);
    setLinks(updated);
  };

  const platformOptions: Option[] = socialPlatforms.map((platform) => ({
    value: platform,
    label: platform.charAt(0).toUpperCase() + platform.slice(1),
  }));

  return (
    <div className="mb-4">
      <label className={styles.Label}>Social Links</label>

      <input
        type="hidden"
        name="socialLinks"
        value={JSON.stringify(links.filter((l) => l.url.trim()))}
      />

      {links.map((link, index) => (
        <div key={index} className="row g-2 align-items-baseline">
          <div className="col-md-5">
            <Select
              name={`socialLinks[${index}].platform`}
              options={platformOptions as unknown as GenericOption<string>[]}
              defaultValue={{
                value: link.platform,
                label: link.platform.charAt(0).toUpperCase() + link.platform.slice(1),
              }}
              isMulti={false}
              onChange={(selected) => {
                const s = toSingle(
                  selected as GenericOption<string> | GenericOption<string>[] | null,
                );
                updateLink(index, 'platform', s?.value || 'linkedin');
              }}
              error={errors?.[`socialLinks.${index}.platform`]?.[0]}
              instanceId={`social-platform-${index}`}
            />
          </div>

          <div className="col-md-6">
            <Input
              name={`socialLinks[${index}].url`}
              placeholder="https://example.com"
              value={link.url}
              onChange={(e) => updateLink(index, 'url', e.target.value)}
              error={errors?.[`socialLinks.${index}.url`]?.[0]}
            />
          </div>

          <div className="col-md-1 d-flex justify-content-center align-items-center">
            <Button
              type="button"
              variant="secondary"
              size="small"
              onClick={() => removeLink(index)}
              disabled={links.length <= 1}
              aria-label="Remove link"
            >
              <FaTrash />
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline-primary"
        size="small"
        onClick={addLink}
        className="mt-2"
      >
        <FaPlus className="me-1" /> Add Social Link
      </Button>

      {errors?.socialLinks?.[0] && (
        <div className="text-danger small mt-2">{errors.socialLinks[0]}</div>
      )}
    </div>
  );
};
