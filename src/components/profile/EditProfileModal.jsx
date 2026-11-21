import { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

const BIO_LIMIT = 200;

export default function EditProfileModal({ user, onSave, onClose }) {
  const [form, setForm] = useState({
    name: user.name,
    location: user.location || '',
    bio: user.bio || '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '', form: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (form.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters.';
    if (form.bio.length > BIO_LIMIT) newErrors.bio = `Bio must be ${BIO_LIMIT} characters or less.`;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      await onSave({
        name: form.name.trim(),
        location: form.location.trim(),
        bio: form.bio.trim(),
      });
    } catch (error) {
      setErrors({ form: error.message });
      setSaving(false);
    }
  };

  return (
    <Modal open onClose={onClose} title="Edit profile">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {errors.form && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errors.form}
          </div>
        )}
        <Input
          id="name"
          name="name"
          label="Full name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
        />
        <Input
          id="location"
          name="location"
          label="Location"
          placeholder="e.g. Dhaka"
          value={form.location}
          onChange={handleChange}
        />
        <div>
          <label htmlFor="bio" className="mb-1 block text-sm font-medium text-slate-700">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            value={form.bio}
            onChange={handleChange}
            placeholder="Tell others about yourself..."
            className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 ${
              errors.bio ? 'border-red-400' : 'border-slate-300'
            }`}
          />
          <div className="mt-1 flex justify-between text-xs">
            <span className="text-red-600">{errors.bio}</span>
            <span className="text-slate-400">
              {form.bio.length}/{BIO_LIMIT}
            </span>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Save changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}