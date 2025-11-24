'use client';

import { useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import styles from './LoginForm.module.scss';
import { useAuth } from '@/hooks/useAuth';

type LoginFormValues = {
  email: string;
  password: string;
};

const LoginForm = (): ReactNode => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { setUser } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: 'admin@example.com',
      password: 'admin123',
    },
  });


  const onSubmit = async (values: LoginFormValues): Promise<void> => {
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message ?? 'Ошибка входа');
      }

      setUser(data.user);
      window.localStorage.setItem('accessToken', data.token);
      setSuccess('Вход выполнен! Токен сохранен в localStorage.');
      
      // Редирект на главную страницу после успешного входа
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 1000);
    }
    catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : 'Ошибка входа',
      );
    }
  };

  return (
    <form className={styles.LoginForm} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          className={styles.input}
          type="email"
          placeholder="admin@example.com"
          {...register('email', { required: 'Email обязателен' })}
        />
        {errors.email?.message && (
          <span className={styles.error}>{errors.email.message}</span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="password">
          Пароль
        </label>
        <input
          id="password"
          className={styles.input}
          type="password"
          placeholder="••••••••"
          {...register('password', { required: 'Пароль обязателен' })}
        />
        {errors.password?.message && (
          <span className={styles.error}>{errors.password.message}</span>
        )}
      </div>

      <div className={styles.actions}>
        <button className={styles.button} type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Вход...' : 'Войти'}
        </button>
        <p className={styles.hint}>
          После успешного входа токен сохранится в localStorage и
          <code>accessToken</code>
          .
        </p>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
    </form>
  );
};

export default LoginForm;

