import { useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../../app/theme.state';
import { useProduct } from '../hook/useProduct';
import '../style/createProduct.scss';
import { useNavigate } from 'react-router-dom';

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'JPY'];
const MAX_IMAGES = 8;

function CreateProduct() {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const themeMode = useSelector((state) => state.theme.mode);
    const { loading } = useSelector((state) => state.products);
    const { handleCreateProduct } = useProduct();

    const [form, setForm] = useState({
        title: '',
        description: '',
        priceAmount: '',
        priceCurrency: 'INR',
    });

    const [images, setImages] = useState([]);   // [{ file, preview }]
    const [isDragging, setIsDragging] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef(null);
    const dragCounter = useRef(0);

    // ── helpers ─────────────────────────────────────────────
    const addFiles = useCallback((files) => {
        const accepted = Array.from(files).filter((f) => f.type.startsWith('image/'));
        const remaining = MAX_IMAGES - images.length;
        const toAdd = accepted.slice(0, remaining).map((file) => ({
            file,
            preview: URL.createObjectURL(file),
            id: `${Date.now()}-${Math.random()}`,
        }));
        setImages((prev) => [...prev, ...toAdd]);
    }, [images.length]);

    const removeImage = (id) => {
        setImages((prev) => {
            const img = prev.find((i) => i.id === id);
            if (img) URL.revokeObjectURL(img.preview);
            return prev.filter((i) => i.id !== id);
        });
    };

    // ── field change ─────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    // ── drag events ──────────────────────────────────────────
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current += 1;
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current -= 1;
        if (dragCounter.current === 0) setIsDragging(false);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        dragCounter.current = 0;
        addFiles(e.dataTransfer.files);
    };

    // ── validation ───────────────────────────────────────────
    const validate = () => {
        const errs = {};
        if (!form.title.trim()) errs.title = 'Title is required.';
        if (!form.description.trim()) errs.description = 'Description is required.';
        if (!form.priceAmount || isNaN(form.priceAmount) || Number(form.price) <= 0)
            errs.priceAmount = 'Enter a valid price.';
        if (images.length === 0) errs.images = 'Add at least one image.';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    // ── submit ───────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const formData = new FormData();
        formData.append('title', form.title.trim());
        formData.append('description', form.description.trim());
        formData.append('priceAmount', form.priceAmount);
        formData.append('priceCurrency', form.priceCurrency);
        images.forEach(({ file }) => formData.append('images', file));
        // console.log('form ',formData);
        
        const product = await handleCreateProduct(formData);
        if (product) {
            setSuccess(true);
            setForm({ title: '', description: '', priceAmount: '', priceCurrency: 'INR' });
            setImages([]);
            setTimeout(() => setSuccess(false), 3500);
        }
        navigate('/seller/products')
    };

    return (
        <div className="cp-page">
            {/* ── Theme toggle ── */}
            {/* <button
                className="cp-theme-toggle"
                onClick={() => dispatch(toggleTheme())}
                aria-label="Toggle theme"
            >
                {themeMode === 'dark' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                )}
                <span>{themeMode === 'dark' ? 'Light' : 'Dark'}</span>
            </button> */}

            {/* ── Success toast ── */}
            {success && (
                <div className="cp-toast cp-toast--success" role="alert">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Product created successfully!
                </div>
            )}

            {/* ── Main card ── */}
            <div className="cp-card">
                {/* Header */}
                <div className="cp-card__header">
                    <div className="cp-card__header-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                    </div>
                    <div>
                        <h1 className="cp-card__title">Create Product</h1>
                        <p className="cp-card__subtitle">Add a new item to your store inventory</p>
                    </div>
                </div>

                {/* Form */}
                <form className="cp-form" onSubmit={handleSubmit} noValidate>
                    {/* ── Left column ── */}
                    <div className="cp-form__left">
                        {/* Title */}
                        <div className={`cp-field ${errors.title ? 'cp-field--error' : ''}`}>
                            <label htmlFor="cp-title" className="cp-field__label">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
                                Product Title
                            </label>
                            <input
                                id="cp-title"
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="e.g. Oversized Graphic Tee"
                                className="cp-field__input"
                                autoComplete="off"
                            />
                            {errors.title && <span className="cp-field__error">{errors.title}</span>}
                        </div>

                        {/* Description */}
                        <div className={`cp-field ${errors.description ? 'cp-field--error' : ''}`}>
                            <label htmlFor="cp-description" className="cp-field__label">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                                Description
                            </label>
                            <textarea
                                id="cp-description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe the product — material, fit, style..."
                                className="cp-field__textarea"
                                rows={5}
                            />
                            {errors.description && <span className="cp-field__error">{errors.description}</span>}
                        </div>

                        {/* Price + Currency */}
                        <div className={`cp-field ${errors.priceAmount ? 'cp-field--error' : ''}`}>
                            <label htmlFor="cp-price" className="cp-field__label">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                                Price &amp; Currency
                            </label>
                            <div className="cp-price-row">
                                <select
                                    name="priceCurrency"
                                    value={form.priceCurrency}
                                    onChange={handleChange}
                                    className="cp-price-row__currency"
                                    aria-label="priceCurrency"
                                >
                                    {CURRENCIES.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                <input
                                    id="cp-price"
                                    type="number"
                                    name="priceAmount"
                                    value={form.priceAmount}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className="cp-price-row__amount"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            {errors.priceAmount && <span className="cp-field__error">{errors.priceAmount}</span>}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="cp-submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="cp-submit__spinner" />
                                    Creating…
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                    Create Product
                                </>
                            )}
                        </button>
                    </div>

                    {/* ── Right column — Images ── */}
                    <div className="cp-form__right">
                        <div className={`cp-field ${errors.images ? 'cp-field--error' : ''}`}>
                            <label className="cp-field__label">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                Product Images
                                <span className="cp-field__label-hint">{images.length}/{MAX_IMAGES}</span>
                            </label>

                            {/* Drop zone */}
                            <div
                                className={`cp-dropzone ${isDragging ? 'cp-dropzone--active' : ''} ${images.length >= MAX_IMAGES ? 'cp-dropzone--full' : ''}`}
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onClick={() => images.length < MAX_IMAGES && fileInputRef.current?.click()}
                                role="button"
                                tabIndex={0}
                                aria-label="Image upload area"
                                onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="cp-dropzone__input"
                                    onChange={(e) => addFiles(e.target.files)}
                                />
                                {images.length === 0 ? (
                                    <div className="cp-dropzone__placeholder">
                                        <div className="cp-dropzone__icon-wrap">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>
                                        </div>
                                        <p className="cp-dropzone__title">
                                            {isDragging ? 'Release to upload' : 'Drag & drop images here'}
                                        </p>
                                        <p className="cp-dropzone__sub">or <span className="cp-dropzone__browse">browse files</span></p>
                                        <p className="cp-dropzone__hint">PNG, JPG, WEBP · Max {MAX_IMAGES} images</p>
                                    </div>
                                ) : (
                                    <div className="cp-dropzone__overlay-hint">
                                        {isDragging ? (
                                            <span>Release to add images</span>
                                        ) : images.length < MAX_IMAGES ? (
                                            <span>+ Add more images</span>
                                        ) : (
                                            <span>Maximum images reached</span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Image grid preview */}
                            {images.length > 0 && (
                                <div className="cp-image-grid">
                                    {images.map((img, idx) => (
                                        <div key={img.id} className="cp-image-thumb">
                                            {idx === 0 && <span className="cp-image-thumb__badge">Cover</span>}
                                            <img src={img.preview} alt={`preview ${idx + 1}`} />
                                            <button
                                                type="button"
                                                className="cp-image-thumb__remove"
                                                onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                                                aria-label="Remove image"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {errors.images && <span className="cp-field__error">{errors.images}</span>}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateProduct;