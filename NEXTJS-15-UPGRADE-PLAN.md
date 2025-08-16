# Next.js 15 Upgrade Plan

## Current State
- **Current Version**: Next.js 14.2.7
- **Target Version**: Next.js 15.4.6
- **React Version**: Will need to upgrade to React 19 (required by Next.js 15)

## Pre-Upgrade Checklist
- [x] All health checks passing (build, typecheck, lint)
- [x] Project using App Router (already implemented)
- [x] All imports using relative paths (fixed)
- [x] Clean git working directory

## Major Breaking Changes in Next.js 15

### 1. React 19 Requirement
- Next.js 15 requires React 19
- Need to update both `react` and `react-dom` to version 19

### 2. Async Request APIs
- `cookies()`, `headers()`, and `params` are now async
- Need to update any server components using these APIs

### 3. Caching Changes
- `fetch()` requests are no longer cached by default
- Route handlers (`GET`, `POST`, etc.) are no longer cached by default
- Client-side navigation cache changed from 30s to 0s by default

### 4. Runtime Configuration Changes
- Minimum Node.js version is now 18.18.0 (we're on 24.4.0, so OK)
- Some configuration options have changed

## Upgrade Steps

### Phase 1: Preparation
1. **Create a backup branch**
   ```bash
   git checkout -b nextjs-15-upgrade
   ```

2. **Review current dependencies**
   ```bash
   npm list next react react-dom
   ```

### Phase 2: Dependency Updates
1. **Update Next.js and React**
   ```bash
   npm install next@15.4.6 react@rc react-dom@rc
   ```

2. **Update React types**
   ```bash
   npm install --save-dev @types/react@latest @types/react-dom@latest
   ```

3. **Update other related dependencies**
   ```bash
   npm update
   ```

### Phase 3: Code Updates

#### 3.1 Update Async APIs
Check and update files using async request APIs:
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/admin/page.tsx`
- All API routes in `src/app/api/`

#### 3.2 Update Middleware
- Review `src/middleware.ts` for any breaking changes

#### 3.3 Update Configuration
- Review `next.config.js` for deprecated options
- Update `tsconfig.json` if needed

#### 3.4 Update Components
- Check all components using `'use client'` directive
- Update any components using deprecated React features

### Phase 4: Testing

1. **Run build**
   ```bash
   npm run build
   ```

2. **Run type check**
   ```bash
   npx tsc --noEmit
   ```

3. **Run lint**
   ```bash
   npm run lint
   ```

4. **Test development server**
   ```bash
   npm run dev
   ```

5. **Test production build**
   ```bash
   npm run build && npm run start
   ```

### Phase 5: Fix Issues

Common issues to watch for:
1. **Async API usage**: Add `await` where needed
2. **Caching behavior**: Add explicit cache directives if needed
3. **Type errors**: Update types for React 19
4. **ESLint warnings**: Update ESLint config if needed

### Phase 6: Performance Optimization

1. **Review caching strategy**
   - Add `cache: 'force-cache'` to fetch calls that should be cached
   - Configure route segment config for static generation

2. **Enable Turbopack** (optional)
   ```json
   {
     "scripts": {
       "dev": "next dev --turbo"
     }
   }
   ```

3. **Review bundle size**
   ```bash
   npm run build
   ```

### Phase 7: Deployment

1. **Test on staging environment first**
2. **Monitor for any runtime errors**
3. **Check performance metrics**
4. **Deploy to production**

## Rollback Plan

If issues arise:
1. **Revert to backup branch**
   ```bash
   git checkout main
   git branch -D nextjs-15-upgrade
   ```

2. **Reinstall dependencies**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## Benefits of Upgrading

1. **Performance Improvements**
   - Faster builds with Turbopack
   - Better tree-shaking
   - Smaller client-side bundles

2. **React 19 Features**
   - Better Suspense support
   - Improved Server Components
   - New hooks and APIs

3. **Developer Experience**
   - Better error messages
   - Improved TypeScript support
   - Faster HMR with Turbopack

4. **Security Updates**
   - Latest security patches
   - Updated dependencies

## Risk Assessment

- **Low Risk**: Project already uses App Router and modern patterns
- **Medium Risk**: Some API routes may need async updates
- **Mitigation**: Comprehensive testing before deployment

## Timeline Estimate

- Preparation: 30 minutes
- Dependency updates: 30 minutes
- Code updates: 1-2 hours
- Testing and fixes: 1-2 hours
- **Total: 3-5 hours**

## Next Steps

1. Review this plan with the team
2. Schedule upgrade during low-traffic period
3. Create backup branch
4. Begin upgrade process
5. Document any issues encountered

---

*Last Updated: January 16, 2025*