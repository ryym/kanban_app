/* Utility */

// Bind 'proto' as the context of all the specified methods.
export function bindMethodContexts(proto, methods) {
  methods.forEach((method) => {
    proto[method] = proto[method].bind(proto);
  });
}
