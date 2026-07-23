# Security & Recovery — priscila-landing

Documento base del futuro "CimaCove Web Protection Standard". Sin contraseñas, tokens ni datos privados.

## 1. Si un deployment falla

1. Revisar el log de build en el dashboard de Cloudflare Pages.
2. Si el error es del build (`npm run build`), reproducirlo localmente antes de tocar nada en producción.
3. El deployment anterior sigue sirviendo tráfico hasta que uno nuevo se complete — no hay downtime automático por un build fallido.

## 2. Volver al último commit funcional

```
git log --oneline
git revert <hash-del-commit-problemático>
git push origin main
```

o, si se prefiere descartar por completo un commit reciente aún no compartido:

```
git reset --hard <hash-del-commit-bueno>
```

(usar `reset --hard` con cuidado: solo si ese commit no fue ya publicado/compartido por otros).

## 3. Si un cambio incorrecto llega a `main`

1. Identificar el commit con `git log`.
2. `git revert <hash>` (no reescribe historia, seguro para ramas compartidas).
3. Push a `main` — Cloudflare Pages redeploya automáticamente.

## 4. Información a conservar para reconstruir Cloudflare Pages

Guardar en un lugar seguro (gestor de contraseñas / documento privado, no en este repo):

- Nombre del proyecto en Cloudflare Pages.
- Dominio(s) personalizado(s) conectado(s) (ej. `priscila.cimacove.com`).
- Comando de build (`npm run build`) y directorio de salida (`dist`).
- Repositorio y rama conectados (`origin/main`).
- Variables de entorno del proyecto, si se agregan en el futuro.

## 5. Si GitHub es comprometido

1. Revocar sesiones activas y tokens desde la configuración de seguridad de la cuenta.
2. Rotar cualquier credencial que pudiera haber estado expuesta (aunque este repo no contiene secretos, revisar igual).
3. Verificar el historial de commits y colaboradores por cambios no autorizados.
4. Si hay una copia/espejo del repo, usarla para restaurar `main` a un estado conocido.
5. Reconectar Cloudflare Pages al repositorio una vez recuperado el acceso.

## 6. Si Cloudflare es comprometido

1. Revocar API Tokens y sesiones activas desde la configuración de la cuenta.
2. Revisar reglas de DNS, Page Rules y configuración de SSL/TLS por cambios no autorizados.
3. Restaurar configuración desde el registro/export guardado (ver punto 4).
4. Si el dominio fue desviado, contactar al registrador y verificar los nameservers.

## 7. Checklist rápido de recuperación

- [ ] ¿El sitio responde en `https://priscila.cimacove.com`?
- [ ] ¿El último deployment en Cloudflare Pages corresponde al último commit de `main`?
- [ ] ¿El certificado SSL es válido y no expiró?
- [ ] ¿`git log` muestra el historial esperado, sin commits desconocidos?
- [ ] ¿Las variables/config de Cloudflare coinciden con lo documentado en el punto 4?
- [ ] ¿2FA sigue activo en GitHub y Cloudflare?
